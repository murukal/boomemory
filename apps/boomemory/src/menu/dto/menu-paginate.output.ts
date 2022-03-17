import { Menu } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class MenuPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [Menu], {
    description: '菜单列表',
  })
  items: Menu[];
}
