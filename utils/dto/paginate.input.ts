import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginateInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
