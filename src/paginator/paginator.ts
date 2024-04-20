import { SelectQueryBuilder } from 'typeorm';

export interface PaginationOptions {
  page: number;
  limit: number;
  total?: boolean;
}

export class PaginationResults<T> {
  constructor(partial: Partial<PaginationResults<T>>) {
    Object.assign(this, partial);
  }

  first: number;
  last: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export async function paginate<T>(
  selectQb: SelectQueryBuilder<T>,
  options: PaginationOptions = {
    page: 1,
    limit: 10,
  },
): Promise<PaginationResults<T>> {
  console.log(options.page, options.limit);
  console.log(options.total);
  const offset = (options.page - 1) * options.limit;
  const total = options.total && (await selectQb.getCount());
  const totalPages = total && Math.ceil(total / options.limit);
  const data = await selectQb.offset(offset).limit(options.limit).getMany();

  return {
    first: offset + 1,
    last: offset + data.length,
    limit: Number(options.limit),
    total,
    totalPages,
    data,
  };
}
