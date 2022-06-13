import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthenticatedProfile {
  @Field(() => String, {
    description: 'token',
    nullable: true,
  })
  token?: string;

  @Field(() => Boolean, {
    description: '是否已验证',
  })
  isVerified: boolean;
}
