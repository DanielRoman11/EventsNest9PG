import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/user/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
  ) {}

  public async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneUserFromEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async getTokenForUser(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id });
  }

  public async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneUserFromEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    if (await bcrypt.compare(pass, user.password)) {
      return {
        access_token: await this.jwtService.signAsync({ sub: user.id }),
      };
    }
    throw new UnauthorizedException('Incorrect Password');
  }

  public async findUserFromToken(userId: string) {
    return this.usersService.findOneUserFromId(userId);
  }
}
