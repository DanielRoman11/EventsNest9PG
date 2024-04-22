import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import constants from '../shared/constants';

export const userProviders = [
  {
    provide: constants.userRepo,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [constants.dataSource],
  },
];
