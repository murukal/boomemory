import { CreateDictionaryEnumInput } from './create-dictionary-enum.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDictionaryEnumInput extends PartialType(
  CreateDictionaryEnumInput,
) {}
