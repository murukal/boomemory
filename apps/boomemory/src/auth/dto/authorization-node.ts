import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class OperationNode {
  @Field(() => Int, {
    description: '操作节点key',
  })
  key: number;

  @Field(() => String, {
    description: '操作描述',
  })
  title: string;
}

@ObjectType()
class ResourceNode {
  @Field(() => String, {
    description: '资源key',
  })
  key: string;

  @Field(() => String, {
    description: '资源描述',
  })
  title: string;

  @Field(() => Boolean, {
    description: '是否展示 Checkbox',
  })
  checkable: false;

  @Field(() => [OperationNode], {
    description: '操作列表',
  })
  children: OperationNode[];
}

@ObjectType()
export class AuthorizationNode {
  @Field(() => String, {
    description: '租户key',
  })
  key: string;

  @Field(() => String, {
    description: '租户描述',
  })
  title: string;

  @Field(() => Boolean, {
    description: '是否展示 Checkbox',
  })
  checkable: false;

  @Field(() => [ResourceNode], {
    description: '资源列表',
  })
  children: ResourceNode[];
}
