import { ObjectType, PickType } from '@nestjs/graphql';
import { UserProfile } from '@app/data-base/entities/boomoney';

@ObjectType()
export class MoneyProfile extends PickType(UserProfile, ['defaultBilling']) {}
