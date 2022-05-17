import { UseInterceptors } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DailyHeat, TopTag, TopTagArgs } from './dto/top-tag';
import { TimeRangeInterceptor } from './interceptor/time-range.interceptor';
import { TopTagLoader } from './top-tag.loader';
import { TopTagService } from './top-tag.service';

@Resolver(() => TopTag)
export class TopTagResolver {
  constructor(
    private readonly topTagLoader: TopTagLoader,
    private readonly topTagService: TopTagService,
  ) {}

  @Query(() => [TopTag], {
    name: 'topTags',
    description: '标签榜单',
  })
  @UseInterceptors(TimeRangeInterceptor)
  async getTopTags(@Args() topTagArgs: TopTagArgs): Promise<TopTag[]> {
    return this.topTagService.getTopTags(5, topTagArgs);
  }

  @ResolveField('dailyHeat', () => [DailyHeat], {
    description: '日发布量',
  })
  getDailyHeat(@Parent() topTag: TopTag) {
    return this.topTagLoader.getDailyHeatByTagId.load(topTag.id);
  }
}
