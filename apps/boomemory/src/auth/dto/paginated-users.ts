import { User } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedUsers extends PaginatedOptions {
  @Field(() => [User], {
    description: '用户列表',
  })
  items: User[];
}
