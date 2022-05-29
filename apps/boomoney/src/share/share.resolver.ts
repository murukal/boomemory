import { User } from '@app/data-base/entities/boomemory';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ShareService } from './share.service';
import { Share } from '@app/data-base/entities/boomoney';
import { ShareLoader } from './share.loader';
import { CreateShareInput } from './dto/create-share.input';
import { RemoveShareInput } from './dto/remove-share.input';

@Resolver(() => Share)
export class ShareResolver {
  constructor(
    private readonly shareService: ShareService,
    private readonly shareLoader: ShareLoader,
  ) {}

  @Mutation(() => Boolean, {
    description: '创建分享',
  })
  createShare(@Args('createShareInput') createShareInput: CreateShareInput) {
    return this.shareService.create(createShareInput);
  }

  @Mutation(() => Boolean, {
    description: '删除分享',
  })
  removeShare(@Args('removeShareInput') removeShareInput: RemoveShareInput) {
    return this.shareService.remove(removeShareInput);
  }

  @ResolveField('sharedBy', () => User, {
    description: '分享人员',
    nullable: true,
  })
  getSharedBy(@Parent() share: Share) {
    return this.shareLoader.getUserById.load(share.sharedById);
  }
}
