import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ){}

  @Post()
  async createUser(@Body() input: CreateUserDto): Promise<User>{
    return this.userService.create(input)
  }
}
