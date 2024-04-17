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
  UsePipes,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import constants from '../constants';
import { DeleteResult, Repository } from 'typeorm';
import { PaginationResults } from '../paginator/paginator';
import { ListEvents } from './input/listEvents';
import { ListEventPipe } from './input/listEvent.pipe';

@Controller('event')
export class EventController {
  private readonly logger: Logger = new Logger(EventController.name);
  constructor(
    private readonly eventService: EventService,
    @Inject(constants.eventRepo)
    private eventRepository: Repository<Event>,
  ) {}

  @Get()
  @UsePipes(ListEventPipe)
  findAllEvents(
    @Query('filter') filter: ListEvents,
  ): Promise<PaginationResults<Event>> {
    this.logger.debug(
      'Pagination Options: ' + JSON.stringify(filter, undefined, 4),
    );
    return this.eventService.findEventsPaginated({
      ...filter,
      currentPage: filter.page,
      total: filter.total,
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
