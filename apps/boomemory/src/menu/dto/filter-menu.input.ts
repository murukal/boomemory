import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterMenuInput {
  @Field(() => Int, { nullable: true, description: '上级菜单ID' })
  parentId?: number;

  @Field(() => Int, { nullable: true, description: '租户ID' })
  tenantId?: number;

  @Field(() => String, { nullable: true, description: '租户Code' })
  tenantCode?: string;
}
