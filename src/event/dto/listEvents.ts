export class ListEvents {
  constructor(partial: Partial<ListEvents> = {}) {
    this.page = partial.page ?? 1;
    this.limit = partial.limit ?? 10;
    this.total = partial.total;
  }

  page: number;
  limit: number;
  total?: boolean;
}
