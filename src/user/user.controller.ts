import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ListUsers } from './dto/ListUsers';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@SerializeOptions({ strategy: 'exposeAll' })
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteUser(@Param('id', ParseUUIDPipe) userId: Pick<User, 'id'>) {
    return await this.userService.deleteUser(userId);
  }
}
