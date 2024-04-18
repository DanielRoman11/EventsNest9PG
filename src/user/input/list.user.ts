export class ListUsers {
  constructor(partial: Partial<ListUsers>){
    Object.assign(this, partial)
  }

  page: number = 1;
  limit: number = 5;
  total?: boolean;
}