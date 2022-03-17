import { Tag } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class TagPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [Tag], {
    description: '标签列表',
  })
  items: Tag[];
}
