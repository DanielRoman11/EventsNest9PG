import { Exclude } from 'class-transformer';
import { Event } from '../../event/entities/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Attendee } from '../../event/entities/attendee.entity';

@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Event, (event) => event.user, {
    cascade: true,
  })
  @JoinColumn()
  events: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  @JoinColumn()
  attendees: Relation<Attendee[]>;

  eventCount?: number;
}
