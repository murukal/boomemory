import { User } from '@app/data-base/entities/boomemory';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ShareService } from './share.service';
import { Share } from '@app/data-base/entities/boomoney';
import { ShareLoader } from './share.loader';

@Resolver(() => Share)
export class ShareResolver {
  constructor(
    private readonly shareService: ShareService,
    private readonly shareLoader: ShareLoader,
  ) {}

  @Mutation(() => Boolean, {
    description: '创建分享',
  })
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

  @ResolveField('sharedBy', () => User, {
    description: '分享人员',
  })
  getSharedBy(@Parent() share: Share) {
    return this.shareLoader.getUserBySharedById.load(share.sharedById);
  }
}
