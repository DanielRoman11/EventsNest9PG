import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
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
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @Inject(constants.userRepo)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  private userBaseQuery(): SelectQueryBuilder<User> {
    return this.userRepo.createQueryBuilder('u').orderBy('u.id');
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
    return await this.userRepo.findOneBy({ id });
  }

  public async findAllUsersPaginated(options: PaginationOptions) {
    const query = this.userBaseQuery()
    .loadRelationCountAndMap('u.eventCount', 'u.events')

    this.logger.debug(query.getQuery());
    return paginate(query, options);
  }

  public async deleteUser(id: string): Promise<DeleteResult> {
    const user = await this.findOneUserFromId(id);
    if (!user) throw new NotFoundException('User Not Found');
    return this.userRepo.delete(id);
  }
}
