import { User } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class UserPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [User])
  items: User[];
}
