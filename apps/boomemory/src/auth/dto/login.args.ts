import { User } from '@app/data-base/entities';
import { ArgsType, Field, PickType } from '@nestjs/graphql';

@ArgsType()
export class LoginArgs extends PickType(User, ['password'], ArgsType) {
  @Field(() => String)
  keyword: string;
}
