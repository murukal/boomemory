import { User } from '@app/data-base/entities/boomemory';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class RegisterInput extends PickType(
  User,
  ['avatar', 'email', 'username'],
  InputType,
) {
  @Field(() => String, {
    description: '密码',
  })
  password: string;
}
