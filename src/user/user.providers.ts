import { DataSource } from 'typeorm';
import constants from '../constants';
import { User } from './user.entity';

export const userProviders = [
  {
    provide: constants.userRepo,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [constants.dataSource],
  },
];
