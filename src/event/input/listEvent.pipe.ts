import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ListEvents } from './listEvents';

@Injectable()
export class ListEventPipe implements PipeTransform {
  transform(value: ListEvents) {
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
