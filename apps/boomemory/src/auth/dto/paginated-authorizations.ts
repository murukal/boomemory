import { Authorization } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedAuthorizations extends PaginatedOptions {
  @Field(() => [Authorization])
  items: Authorization[];
}
