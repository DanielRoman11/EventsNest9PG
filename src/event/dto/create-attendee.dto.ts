import { IsNumber, IsString } from 'class-validator';
import { AttendanceResponse } from '../constants/event.constants';
import { Event } from '../entities/event.entity';

export class CreateAttendeeDto {
  @IsNumber()
  answer: AttendanceResponse;

  @IsNumber()
  eventId: Pick<Event, 'id'>;
}
