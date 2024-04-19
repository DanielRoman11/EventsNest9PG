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
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import constants from '../constants';
import { Repository } from 'typeorm';
import { PaginationResults } from '../paginator/paginator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('event')
export class EventController {
  constructor(
    @Inject(constants.eventRepo)
    private eventRepository: Repository<Event>,
    private readonly eventService: EventService,
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
      total,
    });
  }

  @Get(':id')
  async findOneEvent(@Param('id', ParseIntPipe) id: string): Promise<Event> {
    const event = await this.eventService.findOneEvent(Number(id));
    if (!event) throw new NotFoundException();

    return event;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createEvent(
    @Body() input: CreateEventDto,
    @Request() req: { userId: string },
  ): Promise<Event> {
    return await this.eventService.createEvent(input, req.userId);
  }

  @Patch(':id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
  ): Promise<Event> {
    const event: Event = await this.eventRepository.findOneBy({
      id: id,
    });
    if (!event) throw new NotFoundException();

    return await this.eventService.updateEvent(event, input);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return await this.eventService.deleteEvent(id);
  }
}
