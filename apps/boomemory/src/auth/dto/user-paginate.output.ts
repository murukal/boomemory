import { User } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class UserPaginateOutput extends PaginateOutput {
  @Field(() => [User])
  items: User[];
}
