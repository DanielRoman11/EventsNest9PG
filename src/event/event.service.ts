import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import {
  PaginationOptions,
  PaginationResults,
  paginate,
} from '../paginator/paginator';
import constants from '../shared/constants';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthService } from 'src/auth/auth.service';
import { Attendee } from './entities/attendee.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/users.service';

@Injectable()
export class EventService {
  private readonly logger: Logger = new Logger(EventService.name);
  constructor(
    @Inject(constants.eventRepo)
    private readonly eventRepository: Repository<Event>,
    @Inject(constants.attendeeRepo)
    private readonly attendeeRepository: Repository<Attendee>,
    // private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private eventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id');
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
    options: PaginationOptions,
  ): Promise<PaginationResults<Event>> {
    const query = this.eventBaseQuery().leftJoinAndSelect('e.user', 'user');
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
    console.log('Usuario', user);
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
    const event = await this.eventRepository.findOneBy(eventId);
    if (!event) throw new NotFoundException('Event Not Found');
    return this.eventRepository.delete(event);
  }

  public async attendEvent(
    userId: Pick<User, 'id'>,
    eventId: Pick<Event, 'id'>,
    answer: number,
  ): Promise<Attendee> {
    const user = await this.userService.findOneUserFromId(userId);
    if (!user) throw new NotFoundException('User Not Found');

    const event = await this.eventRepository.findOneBy(eventId);
    if (!event) throw new NotFoundException('Event Not Found');

    return await this.attendeeRepository.save({
      user,
      event,
      answer,
    });
  }
}
