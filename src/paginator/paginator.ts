import { SelectQueryBuilder } from 'typeorm';

export interface PaginationOptions {
  currentPage: number;
  limit: number;
  total?: boolean;
}

export class PaginationResults<T> {
  constructor(partial: Partial<PaginationResults<T>>) {
    Object.assign(this, partial);
  }

  first: number;
  last: number;
  total: number;
  limit: number;
  totalPages: number;
  data: T[];
}

export async function paginate<T>(
  select: SelectQueryBuilder<T>,
  options: PaginationOptions = {
    currentPage: 1,
    limit: 10,
  },
): Promise<PaginationResults<T>> {
  const offset: number = (options.currentPage - 1) * options.limit;
  const data = await select.limit(options.limit).offset(offset).getMany();

  return new PaginationResults({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    totalPages: Math.ceil((await select.getCount()) / options.limit),
    total: options.total && (await select.getCount()),
    data,
  });
}
