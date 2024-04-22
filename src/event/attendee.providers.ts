import { DataSource } from 'typeorm';
import constants from '../shared/constants';
import { Attendee } from './entities/attendee.entity';

export const attendeeProviders = [
  {
    provide: constants.attendeeRepo,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Attendee),
    inject: [constants.dataSource],
  },
];
