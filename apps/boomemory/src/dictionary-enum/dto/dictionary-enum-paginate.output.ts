import { DictionaryEnum } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class DictionaryEnumPaginateOutput extends PaginateOutput {
  @Field(() => [DictionaryEnum], {
    description: '字典枚举列表',
  })
  items: DictionaryEnum[];
}
