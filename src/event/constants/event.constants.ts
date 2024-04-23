import { ListEntityQuery } from '../../shared/ListEntityQuery';

export class ListEvents extends ListEntityQuery {}

export enum AttendanceResponse {
  Yes = 1,
  Interested,
  Maybe,
  Declined,
}
