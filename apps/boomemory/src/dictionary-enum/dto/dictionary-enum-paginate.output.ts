import { DictionaryEnum } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class DictionaryEnumPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [DictionaryEnum], {
    description: '字典枚举列表',
  })
  items: DictionaryEnum[];
}
