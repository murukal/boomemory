import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ToggleService } from './toggle.service';
import { CreateToggleInput } from './dto/create-toggle.input';
import { Essay, Toggle, User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { TopInput } from './dto/top.input';
import { RemoveToggleInput } from './dto/remove-toggle.input';

@Resolver(() => Toggle)
export class ToggleResolver {
  constructor(private readonly toggleService: ToggleService) {}

  @Mutation(() => Boolean, {
    description: '创建触发事件',
  })
  @UseGuards(JwtAuthGuard)
  createToggle(
    @Args('createToggleInput') toggle: CreateToggleInput,
    @CurrentUser() user: User,
  ) {
    return this.toggleService.create(toggle, user.id);
  }

  @Mutation(() => Boolean, {
    description: '删除触发事件',
  })
  @UseGuards(JwtAuthGuard)
  removeToggle(
    @Args('removeToggleInput', {
      type: () => RemoveToggleInput,
      description: '删除事件参数',
    })
    removeToggleInput: RemoveToggleInput,

    @CurrentUser() user: User,
  ) {
    return this.toggleService.remove(removeToggleInput, user.id);
  }

  @Query(() => [Essay], {
    name: 'topEssays',
    description: '获取榜单文章',
  })
  getTopEssays(@Args('topInput') topInput: TopInput) {
    return this.toggleService.getTopEssays(topInput);
  }
}
