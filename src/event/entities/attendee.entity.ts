import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { AttendanceResponse } from '../constants/event.constants';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.attendees)
  user: User;

  @ManyToOne(() => Event, (event) => event.attendees)
  event: Event;

  @Column({
    type: 'enum',
    enum: AttendanceResponse,
    default: AttendanceResponse.Maybe,
  })
  answer: AttendanceResponse;
}
