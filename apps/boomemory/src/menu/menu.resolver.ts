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
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';
import { PaginateInput } from 'utils/dto';
import { PaginatedMenus } from './dto/paginated-menus';
import { FilterMenuInput } from './dto/filter-menu.input';
import { Permission } from 'utils/decorator/permission.decorator';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { AuthorizationActionCode } from '@app/data-base/entities/boomemory/authorization-action.entity';
import { Menu } from '@app/data-base/entities';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Mutation(() => Menu, { description: '创建菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Create,
  })
  createMenu(@Args('createMenuInput') menu: CreateMenuInput) {
    return this.menuService.create(menu);
  }

  @Query(() => PaginatedMenus, {
    name: 'menus',
    description: '查询多个菜单',
  })
  getMenus(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterMenuInput,
  ) {
    return this.menuService.getMenus({
      paginateInput,
      filterInput,
      sortInput: {
        sortBy: 'ASC',
      },
    });
  }

  @Query(() => Menu, { name: 'menu', description: '查询单个菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Retrieve,
  })
  getMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.getMenu(id);
  }

  @Mutation(() => Boolean, { description: '更新菜单' })
  // @Permission({
  //   resource: AuthorizationResourceCode.menu,
  //   action: AuthorizationActionCode.Update,
  // })
  updateMenu(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMenuInput') menu: UpdateMenuInput,
  ) {
    return this.menuService.update(id, menu);
  }

  @Mutation(() => Boolean, { description: '删除菜单' })
  @Permission({
    resource: AuthorizationResourceCode.Menu,
    action: AuthorizationActionCode.Delete,
  })
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
