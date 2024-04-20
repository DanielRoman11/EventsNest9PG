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
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import constants from '../constants';
import { Repository } from 'typeorm';
import { PaginationResults } from '../paginator/paginator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ListEvents } from './dto/listEvents';

@Controller('event')
export class EventController {
  constructor(
    @Inject(constants.eventRepo)
    private readonly eventRepository: Repository<Event>,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  findAllEvents(
    @Query() filter: ListEvents,
  ): Promise<PaginationResults<Event>> {
    return this.eventService.findEventsPaginated({
      page: filter.page,
      limit: filter.limit,
      total: filter.total,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('profile')
  async findAllMyEvents(
    @Query() filter: ListEvents,
    @Request() req: { user: string },
  ): Promise<PaginationResults<Event>> {
    return await this.eventService.findMyEventsPaginated(
      {
        page: filter.page,
        limit: filter.limit,
        total: filter.total,
      },
      req.user,
    );
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
    @Request() req: { user: { userId: string } },
  ): Promise<Event> {
    return await this.eventService.createEvent(input, req.user.userId);
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
