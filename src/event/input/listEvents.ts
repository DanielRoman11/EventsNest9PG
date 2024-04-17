export class ListEvents {
  constructor(partial: Partial<ListEvents>) {
    Object.assign(this, partial);
  }

  page: number = 1;
  limit: number = 10;
  total?: boolean;
}
