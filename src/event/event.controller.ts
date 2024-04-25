import {
  Body,
  Controller,
  Get,
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
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationResults } from '../paginator/paginator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ListEvents } from './constants/event.constants';
import { Attendee } from './entities/attendee.entity';
import { User } from '../user/entities/user.entity';
import { CreateAttendeeDto } from './dto/create-attendee.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProfile(
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

  @Get('attendee')
  async getAttendees(): Promise<any> {
    return await this.eventService.findAllAttendeesOrdered();
  }

  @Get(':id')
  async getEventById(
    @Param('id', ParseIntPipe) id: Pick<Event, 'id'>,
  ): Promise<Event> {
    const event = await this.eventService.findOneEvent(id);
    if (!event) throw new NotFoundException();
    return event;
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllEvents(
    @Query() filter: ListEvents,
  ): Promise<PaginationResults<Event>> {
    return await this.eventService.findEventsPaginated(Number(filter.when), {
      page: filter.page,
      limit: filter.limit,
      total: filter.total,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async createEvent(
    @Body() input: CreateEventDto,
    @Request() req: { user: Pick<User, 'id'> },
  ): Promise<Event> {
    return await this.eventService.createEvent(input, req.user);
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteEvent(
    @Param('id', ParseIntPipe) eventId: Pick<Event, 'id'>,
    @Request() req: { user: Pick<User, 'id'> },
  ) {
    return await this.eventService.deleteEvent(eventId, req.user);
  }

  @Post('attendee')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async attendEvent(
    @Request() req: { user: Pick<User, 'id'> },
    @Body() input: CreateAttendeeDto,
  ): Promise<Attendee> {
    return await this.eventService.createAttendee(
      req.user,
      input.eventId,
      input.answer,
    );
  }
}
