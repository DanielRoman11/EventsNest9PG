import constants from '../constants';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from './event.entity';
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

  public findOneEvent(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id: id });
  }

  public createEvent(event: CreateEventDto): Promise<Event> {
    return this.eventRepository.save({
      ...event,
      when: new Date(event.when),
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
