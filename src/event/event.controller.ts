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
import constants from '../shared/constants';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { PaginationResults } from '../paginator/paginator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AttendanceResponse, ListEvents } from './constants/event.constants';
import { Attendee } from './entities/attendee.entity';
import { User } from '../user/entities/user.entity';

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
    @Request() req: { user: Pick<User, 'id'> },
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
  async findOneEvent(
    @Param('id', ParseIntPipe) id: Pick<Event, 'id'>,
  ): Promise<Event> {
    const event = await this.eventService.findOneEvent(id);
    if (!event) throw new NotFoundException();

    return event;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createEvent(
    @Body() input: CreateEventDto,
    @Request() req: { user: Pick<User, 'id'> },
  ): Promise<Event> {
    return await this.eventService.createEvent(input, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('attendee')
  async attendEvent(
    @Request() req: { user: Pick<User, 'id'> },
    @Body() asnwer: AttendanceResponse,
    eventId: Pick<Event, 'id'>,
  ): Promise<Attendee> {
    return await this.eventService.attendEvent(req.user, eventId, asnwer);
  }

  @Patch(':eventId')
  @UseGuards(JwtAuthGuard)
  async updateEvent(
    @Param('eventId', ParseIntPipe) eventId: Pick<Event, 'id'>,
    @Body() input: UpdateEventDto,
    @Request() req: { user: Pick<User, 'id'> },
  ): Promise<Event> {
    return await this.eventService.updateEvent(eventId, req.user, input);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteEvent(
    @Param('id', ParseIntPipe) eventId: Pick<Event, 'id'>,
    @Request() req: { user: Pick<User, 'id'> },
  ) {
    return await this.eventService.deleteEvent(eventId, req.user);
  }
}
