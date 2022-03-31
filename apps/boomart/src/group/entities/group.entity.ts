import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Group {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
