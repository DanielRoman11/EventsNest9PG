import { ConfigService } from '@nestjs/config';

const constants = {
  dataSource: 'DATA_SOURCE',
  eventRepo: 'EVENTS_REPOSITORY',
  userRepo: 'USER_REPOSITORY',
  attendeeRepo: 'USER_REPOSITORY',
  jwtSecret: (c: ConfigService): string => c.get<string>('JWTSECRET'),
  AuthGuard: 'APP_GUARD',
  IS_PUBLIC_KEY: 'isPublic',
};

export default constants;
