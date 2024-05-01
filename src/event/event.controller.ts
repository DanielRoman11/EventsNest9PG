import {
  Body,
  Controller,
  Get,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getMyEvents(
    @Query() filter: ListEvents,
    @Request() req: { user: Pick<User, 'id'> },
  ): Promise<PaginationResults<Event>> {
    return this.eventService.findMyEventsPaginated(
      {
        page: filter.page,
        limit: filter.limit,
        total: filter.total,
      },
      req.user,
    );
  }

  @Get('attendees')
  getAttendees(): Promise<any> {
    return this.eventService.findAllAttendeesOrdered();
  }

  @Get(':id')
  getEventById(
    @Param('id', ParseIntPipe) id: Pick<Event, 'id'>,
  ): Promise<Event> {
    return this.eventService.findOneEvent(id);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  getAllEvents(@Query() filter: ListEvents): Promise<PaginationResults<Event>> {
    return this.eventService.findEventsPaginated(Number(filter.when), {
      page: filter.page,
      limit: filter.limit,
      total: filter.total,
    });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  createEvent(
    @Body() input: CreateEventDto,
    @Request() req: { user: Pick<User, 'id'> },
  ): Promise<Event> {
    return this.eventService.createEvent(input, req.user);
  }

  @Patch(':eventId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateEvent(
    @Param('eventId', ParseIntPipe) eventId: Pick<Event, 'id'>,
    @Body() input: UpdateEventDto,
    @Request() req: { user: Pick<User, 'id'> },
  ): Promise<Event> {
    return this.eventService.updateEvent(eventId, req.user, input);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  deleteEvent(
    @Param('id', ParseIntPipe) eventId: Pick<Event, 'id'>,
    @Request() req: { user: Pick<User, 'id'> },
  ) {
    return this.eventService.deleteEvent(eventId, req.user);
  }

  @Post('attendee')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  attendEvent(
    @Request() req: { user: Pick<User, 'id'> },
    @Body() input: CreateAttendeeDto,
  ): Promise<Attendee> {
    return this.eventService.createAttendee(
      req.user,
      input.eventId,
      input.answer,
    );
  }
}
