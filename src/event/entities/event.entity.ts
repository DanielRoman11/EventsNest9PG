import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn()
  user: User;

  @OneToMany(() => Attendee, (attendee) => attendee.event)
  @JoinColumn()
  attendees: Relation<Attendee[]>;

  attendeeCount?: number;
}
