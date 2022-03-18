import { DictionaryEnum } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedDictionaryEnum extends PaginatedOptions {
  @Field(() => [DictionaryEnum], {
    description: '字典枚举列表',
  })
  items: DictionaryEnum[];
}
