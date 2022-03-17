import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { PaginateOptionsOutput } from './dto';

export class PaginateOutput<T> extends PaginateOptionsOutput {
  items: T[];
}

export const paginateQuery = async <T>(
  repository: Repository<T>,
  query?: QueryParams,
): Promise<PaginateOutput<T>> => {
  // 入参存在分页需求，计算 skip 值
  // 入参不存在分页需求，以第一条开始取值 skip = 0
  const skip = query?.paginateInput
    ? (query?.paginateInput?.page - 1) * query?.paginateInput?.limit
    : 0;

  // 生成查询 sql
  const [items, total] = await repository
    .createQueryBuilder()
    .skip(skip)
    .limit(query?.paginateInput?.limit)
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
