import { User } from '@app/data-base/entities';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class RegisterInput extends PickType(
  User,
  ['avatar', 'email', 'password', 'username'],
  InputType,
) {}
