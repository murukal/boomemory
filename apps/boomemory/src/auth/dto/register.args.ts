import { User } from '@app/data-base/entities';
import { ArgsType, PickType } from '@nestjs/graphql';

@ArgsType()
export class RegisterArgs extends PickType(
  User,
  ['avatar', 'email', 'password', 'username'],
  ArgsType,
) {}
