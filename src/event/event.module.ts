import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { attendeeProviders } from './attendee.providers';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [...eventProviders, ...attendeeProviders, EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
