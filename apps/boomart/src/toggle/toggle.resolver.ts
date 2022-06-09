import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ToggleService } from './toggle.service';
import { CreateToggleInput } from './dto/create-toggle.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { TopInput } from './dto/top.input';
import { RemoveToggleInput } from './dto/remove-toggle.input';
import { DailyClout, DailyCloutArgs } from './dto/daily-clout.args';
import { Essay, Toggle } from '@app/data-base/entities/boomart';
import { User } from '@app/data-base/entities/boomemory';

@Resolver(() => Toggle)
export class ToggleResolver {
  constructor(private readonly toggleService: ToggleService) {}

  @Mutation(() => Boolean, {
    description: '创建触发事件',
  })
  @UseGuards(new JwtAuthGuard(true))
  createToggle(
    @Args('createToggleInput') toggle: CreateToggleInput,
    @CurrentUser() user: User,
  ) {
    return this.toggleService.create(toggle, user?.id);
  }

  @Mutation(() => Boolean, {
    description: '删除触发事件',
  })
  @UseGuards(JwtAuthGuard)
  removeToggle(
    @Args('removeToggleInput', {
      type: () => RemoveToggleInput,
      description: '删除触发参数',
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

  @Query(() => [DailyClout], {
    name: 'dailyClout',
    description: '日流量',
  })
  getDailyClout(@Args() dailyCloutArgs: DailyCloutArgs) {
    return this.toggleService.getDailyClout(dailyCloutArgs);
  }
}
