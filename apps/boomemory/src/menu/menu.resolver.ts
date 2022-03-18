import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { Menu } from '../../../../libs/data-base/src/entities/boomemory/menu.entity';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';
import { PaginateInput } from 'utils/dto';
import { PaginatedMenus } from './dto/paginated-menus';
import { FilterInput } from './dto/filter.input';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Mutation(() => Menu, { description: '创建租户' })
  createMenu(@Args('createMenuInput') menu: CreateMenuInput) {
    return this.menuService.create(menu);
  }

  @Query(() => PaginatedMenus, {
    name: 'menus',
    description: '查询多个租户',
  })
  getMenus(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterInput,
  ) {
    return this.menuService.getMenus({
      paginateInput,
      filterInput,
    });
  }

  @Query(() => Menu, { name: 'menu', description: '查询单个租户' })
  getMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.getMenu(id);
  }

  @Mutation(() => Boolean, { description: '更新租户' })
  updateMenu(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMenuInput') menu: UpdateMenuInput,
  ) {
    return this.menuService.update(id, menu);
  }

  @Mutation(() => Boolean, { description: '删除租户' })
  removeMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.remove(id);
  }

  @ResolveField(() => Menu, {
    description: '上级菜单',
    name: 'parent',
    nullable: true,
  })
  getParent(@Parent() parent: Menu) {
    return parent.parentId && this.menuService.getMenu(parent.parentId);
  }

  @ResolveField(() => [Menu], {
    description: '下级菜单',
    name: 'children',
    nullable: true,
  })
  async getChildren(@Parent() parent: Menu) {
    return (
      await this.menuService.getMenus({
        filterInput: {
          parentId: parent.id,
        },
      })
    ).items;
  }
}
