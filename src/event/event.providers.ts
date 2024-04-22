import { DataSource } from 'typeorm';
import { Event } from './entities/event.entity';
import constants from '../shared/constants';

export const eventProviders = [
  {
    provide: constants.eventRepo,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Event),
    inject: [constants.dataSource],
  },
];
