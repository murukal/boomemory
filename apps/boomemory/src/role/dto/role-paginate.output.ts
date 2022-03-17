import { Role } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class RolePaginateOutput extends PaginateOptionsOutput {
  @Field(() => [Role], {
    description: '角色列表',
  })
  items: Role[];
}
