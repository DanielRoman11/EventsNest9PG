import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ListUsers } from './dto/ListUsers';
// import { Public } from 'src/auth/auth.guard';

@Controller('user')
@SerializeOptions({ strategy: 'exposeAll' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async signUp(@Body() input: CreateUserDto) {
    return await this.userService.signUp(input);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllUsers(@Query() filter: ListUsers) {
    return await this.userService.findAllUsersPaginated({
      page: filter.page,
      limit: filter.limit,
      total: filter.total,
    });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
