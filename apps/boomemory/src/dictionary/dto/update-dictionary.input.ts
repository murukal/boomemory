import { CreateDictionaryInput } from './create-dictionary.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDictionaryInput extends PartialType(CreateDictionaryInput) {
  @Field(() => Int)
  id: number;
}
