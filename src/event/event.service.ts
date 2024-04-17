import { Injectable, Inject } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from './event.entity';
import constants from '../constants';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  PaginationOptions,
  PaginationResults,
  paginate,
} from '../paginator/paginator';

@Injectable()
export class EventService {
  constructor(
    @Inject(constants.eventRepo)
    private eventRepository: Repository<Event>,
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

  public findOne(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id: id });
  }

  public create(event: CreateEventDto): Promise<Event> {
    return this.eventRepository.save({
      ...event,
      when: new Date(event.when),
    });
  }

  public update(event: Event, eventInput: UpdateEventDto): Promise<Event> {
    return this.eventRepository.save({
      ...event,
      ...eventInput,
      when: eventInput.when ? new Date(eventInput.when) : event.when,
    });
  }

  public delete(event: Event) {
    return this.eventRepository.delete(event.id);
  }
}
