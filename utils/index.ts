import { Repository } from 'typeorm';
import { PaginatedOptions } from './dto';
import type { QueryParams } from 'typings';

export class PaginatedItems<T> extends PaginatedOptions {
  items: T[];
}

export const paginateQuery = async <T, F>(
  repository: Repository<T>,
  query?: QueryParams<F>,
): Promise<PaginatedItems<T>> => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = query?.paginateInput
    ? (query?.paginateInput?.page - 1) * query?.paginateInput?.limit
    : 0;

  // 生成查询 sql
  const [items, total] = await repository
    .createQueryBuilder()
    .where(query?.filterInput || {})
    .skip(skip)
    .take(query?.paginateInput?.limit)
    .orderBy(query?.sortInput)
    .getManyAndCount();

  // 计算 limit
  const limit = query?.paginateInput
    ? query?.paginateInput.limit
    : items.length;

  // 计算总页数
  const pageCount = total === limit ? 1 : Math.floor(total / limit) + 1;

  return {
    items,
    page: query?.paginateInput?.page,
    limit,
    total,
    pageCount,
  };
};
