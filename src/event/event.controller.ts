import { Body, Controller, Get, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import constants from 'src/constants';
import { Repository } from 'typeorm';
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject(constants.eventRepo)
    private eventRepository: Repository<Event>,
  ) { }

  @Get()
  async findAllEvents(): Promise<Event[]> {
    return await this.eventService.findAll();
  }

  @Get(':id')
  async findOneEvent(@Param('id', ParseIntPipe) id: string): Promise<Event> {
    const event = await this.eventService.findOne(Number(id));
    if (!event) throw new NotFoundException()

    return event
  }

  @Post()
  async createEvent(@Body() input: CreateEventDto): Promise<Event> {
    return await this.eventService.create(input)
  }

  @Patch(':id')
  async updateEvent(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() input: UpdateEventDto,
  ) {
    const event: Event = await this.eventRepository.findOneBy({ id: Number(id) })
    console.log(event);
    if(!event) throw new NotFoundException()
    return await this.eventService.update(event, input)
  }
}
