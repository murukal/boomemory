import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterEssayInput {
  @Field(() => [Int], { nullable: true, description: '标签Ids' })
  tagIds?: number[];

  @Field(() => [Int], { nullable: true, description: '文章ids' })
  ids?: number[];
}