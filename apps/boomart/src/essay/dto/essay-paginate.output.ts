import { Essay } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class EssayPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [Essay], {
    description: '文章列表',
  })
  items: Essay[];
}
