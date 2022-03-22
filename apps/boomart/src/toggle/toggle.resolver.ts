import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { ToggleService } from './toggle.service';
import { CreateToggleInput } from './dto/create-toggle.input';
import { Essay, Toggle, User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { TopInput } from './dto/top-essays.input';
import { TargetType } from 'utils/dto/toggle-enum';

@Resolver(() => Toggle)
export class ToggleResolver {
  constructor(private readonly toggleService: ToggleService) {}

  @Mutation(() => Toggle, {
    description: '创建触发事件',
  })
  @UseGuards(JwtAuthGuard)
  createToggle(
    @Args('createToggleInput') toggle: CreateToggleInput,
    @CurrentUser() user: User,
  ) {
    return this.toggleService.create(toggle, user.id);
  }

  @Mutation(() => Toggle, {
    description: '删除触发事件',
  })
  @UseGuards(JwtAuthGuard)
  removeToggle(
    @Args('id', { type: () => Int, description: '触发事件Id' }) id: number,
  ) {
    return this.toggleService.remove(id);
  }

  @Query(() => [Essay], {
    name: 'topEssays',
    description: '查询榜单文章',
  })
  getTopEssays(@Args('topInput') topInput: TopInput) {
    return this.toggleService.getTopTargets(TargetType.essay, topInput);
  }
}
