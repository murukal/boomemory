import { User } from '@app/data-base/entities';
import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { PaginateInput } from './paginate.input';

@ObjectType()
export class PaginateOutput extends PickType(
  PaginateInput,
  ['page', 'limit'],
  ObjectType,
) {
  @Field(() => [User])
  items: User[];
}
