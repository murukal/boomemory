import { Essay } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedEssays extends PaginatedOptions {
  @Field(() => [Essay], {
    description: '文章列表',
  })
  items: Essay[];
}
