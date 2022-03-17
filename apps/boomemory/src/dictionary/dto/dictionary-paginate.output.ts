import { Dictionary } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class DictionaryPaginateOutput extends PaginateOutput {
  @Field(() => [Dictionary], {
    description: '字典列表',
  })
  items: Dictionary[];
}
