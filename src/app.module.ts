import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DatabaseModule, EventModule],
})
export class AppModule {}
