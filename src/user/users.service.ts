import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import constants from 'src/constants';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(constants.userRepo)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async create(input: CreateUserDto) {
    if (input.password !== input.repassword)
      throw new BadRequestException('Password must be identical');

    const userExist = await this.findOne(input.email);
    if (userExist) throw new BadRequestException('Email already taken');

    const user = new User();
    user.username = input.username;
    user.email = input.email;
    user.password = await bcrypt.hash(input.password, 10);

    return {
      ...(await this.userRepo.save(user)),
      access_token: await this.authService.getTokenForUser(user),
    };
  }

  public findOne(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}
