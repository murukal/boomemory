import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterCategoryInput {
  @Field(() => [Int], {
    description: '分类ids',
  })
  ids: number[];
}
