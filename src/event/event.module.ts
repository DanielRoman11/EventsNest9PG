import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...eventProviders,
    EventService
  ],
  controllers: [EventController],
})
export class EventModule { }
