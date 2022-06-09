import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTagInput {
  @Field(() => [Int], { nullable: true, description: '标签ids' })
  ids?: number[];
}
