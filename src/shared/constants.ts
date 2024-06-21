import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

console.log(configService.get<string>('JWTSECRET'));

const constants = {
  dataSource: 'DATA_SOURCE',
  eventRepo: 'EVENTS_REPOSITORY',
  userRepo: 'USER_REPOSITORY',
  attendeeRepo: 'USER_REPOSITORY',
  AuthGuard: 'APP_GUARD',
  IS_PUBLIC_KEY: 'isPublic',
};

export default constants;
