import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import constants from 'src/constants';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: constants.jwtSecret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
