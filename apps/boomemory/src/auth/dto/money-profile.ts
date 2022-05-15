import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Billing, UserProfile } from '@app/data-base/entities/boomoney';

@ObjectType()
export class MoneyProfile extends OmitType(UserProfile, ['userId']) {
  @Field(() => Billing)
  defaultBilling: Billing;
}
