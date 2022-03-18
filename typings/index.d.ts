import { PaginateInput } from 'utils/dto/paginate.input';

export interface QueryParams {
  paginateInput?: PaginateInput;
  filterInput?: Record<string, any>;
}
