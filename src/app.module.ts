import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { AttendeeModule } from './attendee/attendee.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    EventModule,
    AttendeeModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
