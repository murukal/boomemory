import { Menu } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedMenus extends PaginatedOptions {
  @Field(() => [Menu], {
    description: '菜单列表',
  })
  items: Menu[];
}
