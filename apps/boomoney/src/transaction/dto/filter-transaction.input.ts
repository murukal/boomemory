import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTransactionInput {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;
}
