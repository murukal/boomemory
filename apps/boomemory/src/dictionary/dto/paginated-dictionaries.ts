import { Dictionary } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedDictionaries extends PaginatedOptions {
  @Field(() => [Dictionary], {
    description: '字典列表',
  })
  items: Dictionary[];
}
