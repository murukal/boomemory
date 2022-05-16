import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { ShareService } from './share.service';

@Resolver()
export class ShareResolver {
  constructor(private readonly shareService: ShareService) {}

  @Mutation(() => Boolean)
  createShare(
    @Args('targetId', { type: () => Int, description: '目标ID' })
    targetId: number,
    @Args('targetType', { type: () => TargetType, description: '目标类型' })
    targetType: TargetType,
    @Args('userIds', {
      type: () => [Int],
      description: '共享人Ids',
    })
    userIds: number[],
  ) {
    return this.shareService.create(targetId, targetType, userIds);
  }
}
