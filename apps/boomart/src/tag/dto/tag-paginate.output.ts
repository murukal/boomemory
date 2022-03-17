import { Tag } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class TagPaginateOutput extends PaginateOutput {
  @Field(() => [Tag], {
    description: '标签列表',
  })
  items: Tag[];
}
