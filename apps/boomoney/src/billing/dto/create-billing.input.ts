import { Billing } from '@app/data-base/entities/boomoney';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateBillingInput extends PickType(
  Billing,
  ['name'],
  InputType,
) {}
