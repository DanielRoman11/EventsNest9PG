import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ListUsers } from './list.user';

@Injectable()
export class ListUserPipe implements PipeTransform {
  transform(value: ListUsers) {
    if (!value) return {};

    try {
      value.limit = Number(value.limit);
      value.page = Number(value.page);
      value.total = value.total && Boolean(value.total);

      return value;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
