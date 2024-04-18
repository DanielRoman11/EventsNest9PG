import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
  HttpCode,
  Query,
  Logger,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import constants from '../constants';
import { DeleteResult, Repository } from 'typeorm';
import { PaginationResults } from '../paginator/paginator';

@Controller('event')
export class EventController {
  private readonly logger: Logger = new Logger(EventController.name);
  constructor(
    private readonly eventService: EventService,
    @Inject(constants.eventRepo)
    private eventRepository: Repository<Event>,
  ) {}

  @Get()
  findAllEvents(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('total') total: boolean = false,
  ): Promise<PaginationResults<Event>> {
    return this.eventService.findEventsPaginated({
      page: Number(page),
      limit: Number(limit),
      total: total && Boolean(total),
    });
  }

  @Get(':id')
  async findOneEvent(@Param('id', ParseIntPipe) id: string): Promise<Event> {
    const event = await this.eventService.findOne(Number(id));
    if (!event) throw new NotFoundException();

    return event;
  }

  @Post()
  async createEvent(@Body() input: CreateEventDto): Promise<Event> {
    return await this.eventService.create(input);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() input: UpdateEventDto,
  ): Promise<Event> {
    const event: Event = await this.eventRepository.findOneBy({
      id: Number(id),
    });
    if (!event) throw new NotFoundException();

    return await this.eventService.update(event, input);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteEvent(
    @Param('id', new ParseIntPipe()) id: string,
  ): Promise<DeleteResult> {
    const event: Event = await this.eventRepository.findOneBy({
      id: Number(id),
    });
    if (!event) throw new NotFoundException();

    return await this.eventService.delete(event);
  }
}
