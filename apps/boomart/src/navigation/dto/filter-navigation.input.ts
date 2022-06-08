import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterNavigationInput {
  @Field(() => [Int], { nullable: true, description: '标签ids' })
  tagIds?: number[];
}
