import { CreateDictionaryInput } from './create-dictionary.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDictionaryInput extends PartialType(CreateDictionaryInput) {}
