import { DataSource } from 'typeorm';
import { Event } from './event.entity';
import constants from '../constants';

export const eventProviders = [
  {
    provide: constants.eventRepo,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Event),
    inject: [constants.dataSource],
  },
];
