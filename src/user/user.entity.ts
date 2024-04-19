import { Exclude } from 'class-transformer';
import { Event } from 'src/event/event.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    // cascade: true,
    // onDelete: 'CASCADE',
    // eager: true
  })
  @JoinColumn()
  events: Event[];
}
