import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DailyHeat, TopTag } from './dto/top-tag';
import { TagLoader } from './tag.loader';

@Resolver(() => TopTag)
export class TopTagResolver {
  constructor(private readonly tagLoader: TagLoader) {}

  @ResolveField('dailyHeat', () => [DailyHeat], {
    description: '日发布量',
  })
  getDailyHeat(@Parent() topTag: TopTag) {
    return this.tagLoader.getDailyHeatByTagId.load(topTag.id);
  }
}
