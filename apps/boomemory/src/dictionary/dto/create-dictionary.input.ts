import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDictionaryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
