import { Dictionary } from '@app/data-base/entities';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateDictionaryInput extends PickType(
  Dictionary,
  ['code', 'description', 'sortBy'],
  InputType,
) {}
