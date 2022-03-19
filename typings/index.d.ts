import { PaginateInput } from 'utils/dto/paginate.input';

export interface QueryParams<F = Record<string, any>> {
  paginateInput?: PaginateInput;
  filterInput?: F;
}
