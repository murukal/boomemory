import { CreateRoleInput } from './create-role.input';
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field(() => [Int], {
    description: '角色关联的用户id',
    nullable: true,
  })
  userIds?: number[];

  @Field(() => [Int], {
    description: '角色关联的权限id',
    nullable: true,
  })
  authorizationIds?: number[];
}
