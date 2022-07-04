import { Direction } from '@app/data-base/entities/boomoney/transaction.entity';
import { Field, InputType, Int } from '@nestjs/graphql';
import { TimeRangeInput } from 'utils/dto/time-range.input';

@InputType()
export class FilterTransactionInput extends TimeRangeInput {
  @Field(() => Int, {
    description: '账本id',
  })
  billingId: number;

  @Field(() => [Direction], {
    description: '交易方向',
  })
  directions: Direction[];
}
