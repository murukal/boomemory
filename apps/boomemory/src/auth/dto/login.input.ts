import { User } from '@app/data-base/entities';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class LoginInput extends PickType(User, ['password'], InputType) {
  @Field(() => String)
  keyword: string;
}
