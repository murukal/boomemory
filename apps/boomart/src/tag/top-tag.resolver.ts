import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DailyHeat, TopTag, TopTagArgs } from './dto/top-tag';
import { TagLoader } from './tag.loader';
import { TagService } from './tag.service';

@Resolver(() => TopTag)
export class TopTagResolver {
  constructor(
    private readonly tagLoader: TagLoader,
    private readonly tagService: TagService,
  ) {}

  @Query(() => [TopTag], {
    name: 'topTags',
    description: '标签榜单',
  })
  async getTopTags(@Args() topTagArgs: TopTagArgs): Promise<TopTag[]> {
    return this.tagLoader.initializeGetDailyHeatByTagId(
      topTagArgs.from,
      topTagArgs.to,
    )
      ? this.tagService.getTopTags()
      : [];
  }

  @ResolveField('dailyHeat', () => [DailyHeat], {
    description: '日发布量',
  })
  getDailyHeat(@Parent() topTag: TopTag) {
    return this.tagLoader.getDailyHeatByTagId.load(topTag.id);
  }
}
