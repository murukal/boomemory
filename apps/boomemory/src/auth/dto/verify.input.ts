import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class VerifyInput {
  @Field(() => String, {
    description: '验证码',
  })
  captcha: string;
}
