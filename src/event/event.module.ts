import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { UserService } from 'src/user/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [...eventProviders, EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
