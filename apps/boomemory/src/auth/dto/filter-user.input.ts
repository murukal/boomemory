import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterUserInput {
  @Field(() => [Int], { nullable: true, description: '用户ids' })
  ids?: number[];

  @Field(() => [Int], { nullable: true, description: '需要排除的用户ids' })
  excludeIds?: number[];
}
