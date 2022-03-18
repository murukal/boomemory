import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterInput {
  @Field(() => String, { nullable: true })
  parentId?: string;
}
