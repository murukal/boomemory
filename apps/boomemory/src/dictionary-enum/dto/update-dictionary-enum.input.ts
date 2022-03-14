import { CreateDictionaryEnumInput } from './create-dictionary-enum.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDictionaryEnumInput extends PartialType(CreateDictionaryEnumInput) {
  @Field(() => Int)
  id: number;
}
