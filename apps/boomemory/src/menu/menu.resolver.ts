import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { Menu } from '../../../../libs/data-base/src/entities/boomemory/menu.entity';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Mutation(() => Menu)
  createMenu(@Args('createMenuInput') menu: CreateMenuInput) {
    return this.menuService.create(menu);
  }

  @Query(() => [Menu], { name: 'menus' })
  getMenus() {
    return this.menuService.getMenus();
  }

  @Query(() => Menu, { name: 'menu' })
  getMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.getMenu(id);
  }

  @Mutation(() => Boolean)
  updateMenu(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMenuInput') menu: UpdateMenuInput,
  ) {
    return this.menuService.update(id, menu);
  }

  @Mutation(() => Menu)
  removeMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.remove(id);
  }
}
