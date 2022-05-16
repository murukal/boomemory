import { Transaction } from '@app/data-base/entities/boomoney';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput extends PickType(
  Transaction,
  ['amount', 'billingId', 'categoryId'],
  InputType,
) {}
