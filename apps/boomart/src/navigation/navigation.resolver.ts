import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NavigationService } from './navigation.service';
import { Navigation } from '../../../../libs/data-base/src/entities/boomart/navigation.entity';
import { CreateNavigationInput } from './dto/create-navigation.input';
import { UpdateNavigationInput } from './dto/update-navigation.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { PaginateInput } from 'utils/dto';
import { FilterNavigationInput } from './dto/filter-navigation.input';
import { Tag } from '@app/data-base/entities/boomart';
import { NavigationLoader } from './navigation.loader';

@Resolver(() => Navigation)
export class NavigationResolver {
  constructor(
    private readonly navigationService: NavigationService,
    private readonly navigationLoader: NavigationLoader,
  ) {}

  @Mutation(() => Navigation, {
    description: '创建导航',
  })
  @UseGuards(JwtAuthGuard)
  createNavigation(
    @Args('createNavigationInput') createNavigationInput: CreateNavigationInput,
  ) {
    return this.navigationService.create(createNavigationInput);
  }

  @Query(() => [Navigation], {
    name: 'navigations',
    description: '分页查询导航',
  })
  getNavigations(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterNavigationInput,
  ) {
    return this.navigationService.getNavigations({
      paginateInput,
      filterInput,
    });
  }

  @Query(() => Navigation, { name: 'navigation', description: '查询单个导航' })
  getNavigate(@Args('id', { type: () => Int }) id: number) {
    return this.navigationService.getNavigate(id);
  }

  @Mutation(() => Navigation, {
    description: '更新导航',
  })
  @UseGuards(JwtAuthGuard)
  updateNavigation(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateNavigationInput') updateNavigationInput: UpdateNavigationInput,
  ) {
    return this.navigationService.update(id, updateNavigationInput);
  }

  @Mutation(() => Navigation, {
    description: '删除导航',
  })
  removeNavigation(@Args('id', { type: () => Int }) id: number) {
    return this.navigationService.remove(id);
  }

  @ResolveField('tags', () => Tag, {
    description: '标签',
  })
  getTags(@Parent() navigation: Navigation) {
    return this.navigationLoader.getTagsByNavigationId.load(navigation.id);
  }
}
