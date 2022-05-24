import { Direction } from '@app/data-base/entities/boomoney/transaction.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterTransactionInput {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Direction], {
    description: '交易方向',
  })
  directions: Direction[];
}
