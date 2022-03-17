import { Dictionary } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class DictionaryPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [Dictionary], {
    description: '字典列表',
  })
  items: Dictionary[];
}
