import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsers } from './input/list.user';
import { ListUserPipe } from './input/listUser.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() input: CreateUserDto) {
    return this.userService.create(input);
  }

  @Get()
  @UsePipes(ListUserPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllUsers(
    @Query('filter') filter: ListUsers
  ){
    return this.userService.findAllUsersPaginated({
      ...filter,
      currentPage: filter.page
    });
  }
}
