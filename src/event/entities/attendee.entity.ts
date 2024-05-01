import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Event } from './event.entity';
import { AttendanceResponse } from '../constants/event.constants';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.attendees)
  user: Relation<User>;

  @ManyToOne(() => Event, (event) => event.attendees)
  event: Relation<Event>;

  @Column({
    type: 'enum',
    enum: AttendanceResponse,
    default: AttendanceResponse.Maybe,
  })
  answer: AttendanceResponse;
}
