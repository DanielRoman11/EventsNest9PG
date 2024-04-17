import { DataSource } from 'typeorm';
import constants from 'src/constants';
export const databaseProviders = [
  {
    provide: constants.dataSource,
    useFactory: async () => {
      try {
        const dataSource = new DataSource({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        });

        return await dataSource.initialize();
      } catch (error) {
        console.error('Database Connection Fails! ', error.message);
        throw error;
      }
    },
  },
];
