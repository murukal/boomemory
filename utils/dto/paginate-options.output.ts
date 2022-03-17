import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { PaginateInput } from './paginate.input';

@ObjectType()
export class PaginateOptionsOutput extends PickType(
  PaginateInput,
  ['page', 'limit'],
  ObjectType,
) {
  @Field(() => Int, { description: '总条目数' })
  total: number;

  @Field(() => Int, { description: '总页数' })
  pageCount: number;
}
