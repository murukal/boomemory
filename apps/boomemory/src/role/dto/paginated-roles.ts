import { Role } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedRole extends PaginatedOptions {
  @Field(() => [Role], {
    description: '角色列表',
  })
  items: Role[];
}
