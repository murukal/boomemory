import { Role } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class RolePaginateOutput extends PaginateOutput {
  @Field(() => [Role], {
    description: '角色列表',
  })
  items: Role[];
}
