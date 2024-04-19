import constants from '../constants';
import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class EventService {
  constructor(
    @Inject(constants.eventRepo)
    private readonly eventRepository: Repository<Event>,
    private readonly authService: AuthService
  ) {}

  //? PRIVATE METHODS
  private eventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id');
  }

  //? PUBLIC METHODS
  public async findEventsPaginated(
    options: PaginationOptions,
  ): Promise<PaginationResults<Event>> {
    return paginate(this.eventBaseQuery(), { ...options });
  }

  public findOneEvent(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id: id });
  }

  public async createEvent(event: CreateEventDto, id: string): Promise<Event> {
    const user = await this.authService.findUserFromToken(id)
    if(!user) throw new UnauthorizedException('Not Authenticated')
    
    return this.eventRepository.save({
      ...event,
      when: new Date(event.when),
      user: user
    });
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
