import constants from '../constants';
import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  PaginationOptions,
  PaginationResults,
  paginate,
} from '../paginator/paginator';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class EventService {
  private readonly logger: Logger = new Logger(EventService.name);
  constructor(
    @Inject(constants.eventRepo)
    private readonly eventRepository: Repository<Event>,
    private readonly authService: AuthService,
  ) {}

  private eventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id');
  }

  public async findMyEventsPaginated(
    options: PaginationOptions,
    userId: string,
  ): Promise<PaginationResults<Event>> {
    const query = this.eventBaseQuery().where('e.userId = :userId', {
      userId,
    });
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

  public findOneEvent(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id: id });
  }

  public async createEvent(event: CreateEventDto, userId: string): Promise<Event> {
    const user = await this.authService.findUserFromToken(userId);
    if (user)
      return this.eventRepository.save({
        ...event,
        when: new Date(event.when),
        user: user,
      });

    throw new UnauthorizedException('Not Authenticated');
  }

  public updateEvent(event: Event, eventInput: UpdateEventDto): Promise<Event> {
    return this.eventRepository.save({
      ...event,
      ...eventInput,
      when: eventInput.when ? new Date(eventInput.when) : event.when,
    });
  }

  public async deleteEvent(id: number) {
    const event = await this.eventRepository.findOneBy({
      id: id,
    });
    if (!event) throw new NotFoundException('Event Not Found');
    return this.eventRepository.delete(id);
  }
}
