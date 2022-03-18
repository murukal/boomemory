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
  description: string;
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
  description: string;

  @Field(() => [OperationNode], {
    description: '操作列表',
  })
  children: OperationNode[];
}

@ObjectType()
export class AuthorizationTree {
  @Field(() => String, {
    description: '租户key',
  })
  key: string;

  @Field(() => String, {
    description: '租户描述',
  })
  description: string;

  @Field(() => [ResourceNode], {
    description: '资源列表',
  })
  children: ResourceNode[];
}
