import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() input: CreateUserDto) {
    return this.userService.create(input);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('total') total: boolean = false,
  ) {
    return this.userService.findAllUsersPaginated({
      page,
      limit,
      total,
    });
  }
}
