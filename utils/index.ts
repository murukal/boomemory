import { Repository } from 'typeorm';
import { QueryParams } from 'typings';

export const paginateQuery = <T>(
  repository: Repository<T>,
  query?: QueryParams,
) => {
  const skip = (query.paginateInput.page - 1) * query.paginateInput.limit;

  const items = repository
    .createQueryBuilder()
    .skip(skip)
    .limit(query.paginateInput.limit)
    .getMany();

  return {
    items,
    page: query.paginateInput.page,
    limit: query.paginateInput.limit,
  };
};
