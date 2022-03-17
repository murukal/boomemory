import { Menu } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOutput } from 'utils/dto';

@ObjectType()
export class MenuPaginateOutput extends PaginateOutput {
  @Field(() => [Menu], {
    description: '菜单列表',
  })
  items: Menu[];
}
