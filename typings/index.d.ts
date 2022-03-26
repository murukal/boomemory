import { PaginateInput } from 'utils/dto/paginate.input';

interface SortInput {
  [columnName: string]:
    | ('ASC' | 'DESC')
    | {
        order: 'ASC' | 'DESC';
        nulls?: 'NULLS FIRST' | 'NULLS LAST';
      };
}

export interface QueryParams<F = Record<string, any>> {
  paginateInput?: PaginateInput;
  filterInput?: F;
  sortInput?: SortInput;
}
