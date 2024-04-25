import { ListEntityQuery } from '../../shared/ListEntityQuery';

export class ListEvents extends ListEntityQuery {
  constructor(partial: Partial<ListEvents> = {}) {
    super(partial);
    partial.when = +partial.when || null;
  }

  when?: FilterDateEvent | null = null;
}

export enum AttendanceResponse {
  Yes = 1,
  Interested,
  Maybe,
  Declined,
}

export enum FilterDateEvent {
  All = 1,
  ThisWeek,
  ThisMonth,
  NextMonth,
  NextYear,
}
