import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from './event.entity';
import constants from '../constants';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @Inject(constants.eventRepo)
    private eventRepository: Repository<Event>,
  ) { }

  public findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  public findOne(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id: id })
  }

  public create(event: CreateEventDto) {
    return this.eventRepository.save({
      ...event,
      when: new Date(event.when)
    })
  }

  public async update(event: Event, eventInput: UpdateEventDto) {
    return this.eventRepository.save({
      ...event,
      ...eventInput,
      when: eventInput.when ? new Date(eventInput.when) : event.when
    })
  }

  private eventBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventRepository.createQueryBuilder('e')
  }



  private findEventFilterDateQuery() {
    const event = this.eventBaseQuery()
      .where('e.when ')
  }
}
