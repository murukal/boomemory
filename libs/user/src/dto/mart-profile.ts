import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MartProfile {
  @Field(() => Int, {
    description: '作品个数',
  })
  creationCount: number;
}
