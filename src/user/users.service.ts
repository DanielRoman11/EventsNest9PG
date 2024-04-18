import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import constants from 'src/constants';
import * as bcrypt from 'bcrypt';
import { paginate, PaginationOptions } from 'src/paginator/paginator';

@Injectable()
export class UserService {
  constructor(
    @Inject(constants.userRepo)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  private userBaseQuery(): SelectQueryBuilder<User> {
    return this.userRepo.createQueryBuilder('e').orderBy('e.id');
  }

  public async signUp(input: CreateUserDto) {
    if (input.password !== input.repassword)
      throw new BadRequestException('Password must be identical');

    const userExist = await this.findOneUserFromEmail(input.email);
    if (userExist) throw new BadRequestException('Email already taken');

    const user = new User({
      username: input.username,
      email: input.email,
      password: await bcrypt.hash(input.password, 10),
    });

    const { password, ...savedUser } = await this.userRepo.save(user);

    return {
      ...savedUser,
      access_token: await this.authService.getTokenForUser(user),
    };
  }

  public findOneUserFromEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }

  public async findOneUserFromId(id: string): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  public async findAllUsersPaginated(options: PaginationOptions) {
    return paginate(this.userBaseQuery(), { ...options });
  }

  public async deleteUser(id: string): Promise<DeleteResult> {
    const user = await this.findOneUserFromId(id);
    if (!user) throw new NotFoundException('User Not Found');
    return this.userRepo.delete(id);
  }
}
