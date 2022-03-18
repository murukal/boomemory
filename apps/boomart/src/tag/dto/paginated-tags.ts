import { Tag } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedTags extends PaginatedOptions {
  @Field(() => [Tag], {
    description: '标签列表',
  })
  items: Tag[];
}
