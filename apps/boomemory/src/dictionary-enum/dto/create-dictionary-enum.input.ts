import { DictionaryEnum } from '@app/data-base/entities/boomemory/dictionary-enum.entity';
import { Field, InputType, Int, PickType } from '@nestjs/graphql';

@InputType()
export class CreateDictionaryEnumInput extends PickType(
  DictionaryEnum,
  ['code', 'description', 'sortBy'],
  InputType,
) {
  @Field(() => Int, {
    description: '字典ID',
  })
  parentId: number;
}
