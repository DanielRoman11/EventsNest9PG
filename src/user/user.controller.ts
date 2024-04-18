import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async signUp(@Body() input: CreateUserDto) {
    return await this.userService.signUp(input);
  }

  @Public()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('total') total: boolean = false,
  ) {
    return await this.userService.findAllUsersPaginated({
      page: Number(page),
      limit: Number(limit),
      total,
    });
  }

  @Public()
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
