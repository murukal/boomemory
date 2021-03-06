import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterEssayInput {
  @Field(() => [Int], { nullable: true, description: '标签ids' })
  tagIds?: number[];

  @Field(() => [Int], { nullable: true, description: '导航ids' })
  ids?: number[];
}
