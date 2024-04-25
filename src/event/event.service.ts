import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  PaginationOptions,
  PaginationResults,
  paginate,
} from '../paginator/paginator';
import constants from '../shared/constants';
import { User } from 'src/user/entities/user.entity';
import { Event } from './entities/event.entity';
import { Attendee } from './entities/attendee.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserService } from 'src/user/users.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterDateEvent } from './constants/event.constants';

@Injectable()
export class EventService {
  private readonly logger: Logger = new Logger(EventService.name);
  constructor(
    @Inject(constants.eventRepo)
    private readonly eventRepository: Repository<Event>,
    @Inject(constants.attendeeRepo)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly userService: UserService,
  ) {}

  private eventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id');
  }

  private attendeeBaseQuery(): SelectQueryBuilder<Attendee> {
    return this.attendeeRepository.createQueryBuilder('a').orderBy('a.id');
  }

  private findEventsFilteredByDated(
    filter: FilterDateEvent,
  ): SelectQueryBuilder<Event> {
    const query = this.eventBaseQuery();
    switch (filter) {
      default:
        return query;
      case FilterDateEvent.All:
        return query;
      case FilterDateEvent.ThisWeek:
        return query.where(
          "e.when BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 week'",
        );
      case FilterDateEvent.ThisMonth:
        return query.where(
          "e.when BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 month'",
        );
      case FilterDateEvent.NextMonth:
        return query.where(
          "e.when BETWEEN CURRENT_DATE + INTERVAL '1 month' AND CURRENT_DATE + INTERVAL '2 month' - INTERVAL '1 day'",
        );
      case FilterDateEvent.NextYear:
        return query.where("e.when >= CURRENT_DATE + INTERVAL '1 year'");
    }
  }

  public async findMyEventsPaginated(
    options: PaginationOptions,
    userId: Pick<User, 'id'>,
  ): Promise<PaginationResults<Event>> {
    const query = this.eventBaseQuery().where('e.userId = :userId', { userId });
    this.logger.debug(query.getQuery());
    return paginate(query, options);
  }

  public async findEventsPaginated(
    filter: FilterDateEvent,
    options: PaginationOptions,
  ): Promise<PaginationResults<Event>> {
    const query = this.findEventsFilteredByDated(filter).leftJoinAndSelect(
      'e.user',
      'user',
    );
    this.logger.debug(query.getQuery());
    return paginate(query, options);
  }

  public findOneEvent(id: Pick<Event, 'id'>): Promise<Event> {
    const query = this.eventBaseQuery().where({ id });
    this.logger.debug(query.getQuery());
    return query.getOne();
  }

  public async createEvent(
    event: CreateEventDto,
    userId: Pick<User, 'id'>,
  ): Promise<Event> {
    const user = await this.userService.findOneUserFromId(userId);
    if (user)
      return this.eventRepository.save({
        ...event,
        when: new Date(event.when),
        user: user,
      });

    throw new UnauthorizedException('Not Authenticated');
  }

  public async updateEvent(
    eventId: Pick<Event, 'id'>,
    userId: Pick<User, 'id'>,
    eventInput: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.eventBaseQuery()
      .where({ id: eventId })
      .addSelect('u.id')
      .leftJoin('e.user', 'u')
      .getOne();
    if (!event) throw new NotFoundException('Event Not Found');

    const user = await this.userService.findOneUserFromId(userId);
    if (!user) throw new NotFoundException('User Not Found');

    if (event.user.id !== user.id) throw new UnauthorizedException();

    return await this.eventRepository.save({
      ...event,
      ...eventInput,
      when: eventInput.when ? new Date(eventInput.when) : event.when,
    });
  }

  public async deleteEvent(
    eventId: Pick<Event, 'id'>,
    userId: Pick<User, 'id'>,
  ) {
    const event = await this.eventBaseQuery()
      .addSelect('u.id')
      .leftJoin('e.user', 'u')
      .where({ id: eventId })
      .getOne();
    if (!event) throw new NotFoundException('Event Not Found');

    const user = await this.userService.findOneUserFromId(userId);
    if (!user) throw new NotFoundException('User does not exist');

    if (user.id !== event.user.id) throw new UnauthorizedException();

    return await this.eventRepository.delete(event);
  }

  public async findAllAttendeesOrdered() {
    const attendees = this.attendeeBaseQuery().loadAllRelationIds();
    this.logger.debug(attendees.getQuery());
    return await attendees.getMany();
  }

  public async createAttendee(
    userId: Pick<User, 'id'>,
    eventId: Pick<Event, 'id'>,
    answer: number,
  ): Promise<Attendee> {
    const user = await this.userService.findOneUserFromId(userId);
    if (!user) throw new NotFoundException('User Not Found');

    const event = await this.eventBaseQuery()
      .addSelect('u.id')
      .leftJoin('e.user', 'u')
      .where(eventId)
      .getOne();

    if (!event) throw new NotFoundException('Event Not Found');

    if (event.user.id === user.id)
      throw new BadRequestException('Cannot attend your own event');

    const attendee = await this.attendeeBaseQuery()
      .where({ event: event })
      .andWhere({ user: user })
      .getOne();

    if (attendee)
      throw new BadRequestException(
        'This user is currently attending this event',
      );

    return await this.attendeeRepository.save({
      user,
      event,
      answer,
    });
  }
}
