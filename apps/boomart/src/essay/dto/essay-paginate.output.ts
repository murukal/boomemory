import { Essay } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class EssayPaginateOutput extends PaginateOutput {
  @Field(() => [Essay], {
    description: '文章列表',
  })
  items: Essay[];
}
