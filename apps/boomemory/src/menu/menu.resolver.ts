import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { Menu } from '../../../../libs/data-base/src/entities/boomemory/menu.entity';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';

@Resolver(() => Menu)
export class MenuResolver {
  constructor(private readonly menuService: MenuService) {}

  @Mutation(() => Menu)
  createMenu(@Args() menu: CreateMenuInput) {
    return this.menuService.create(menu);
  }

  @Query(() => [Menu], { name: 'menu' })
  findAll() {
    return this.menuService.findAll();
  }

  @Query(() => Menu, { name: 'menu' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.findOne(id);
  }

  @Mutation(() => Menu)
  updateMenu(@Args('updateMenuInput') updateMenuInput: UpdateMenuInput) {
    return this.menuService.update(updateMenuInput.id, updateMenuInput);
  }

  @Mutation(() => Menu)
  removeMenu(@Args('id', { type: () => Int }) id: number) {
    return this.menuService.remove(id);
  }
}
