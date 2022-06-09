import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BillingService } from './billing.service';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { Billing, Share } from '@app/data-base/entities/boomoney';
import { User } from '@app/data-base/entities/boomemory';
import { BillingLoader } from './billing.loader';
import { ShareInterceptor } from './interceptor/share.interceptor';

@Resolver(() => Billing)
export class BillingResolver {
  constructor(
    private readonly billingService: BillingService,
    private readonly billingLoader: BillingLoader,
  ) {}

  @Mutation(() => Billing, {
    description: '创建账本',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ShareInterceptor)
  createBilling(
    @Args('createBillingInput') createBillingInput: CreateBillingInput,
    @CurrentUser() user: User,
  ) {
    return this.billingService.create(createBillingInput, user.id);
  }

  @Query(() => [Billing], { name: 'billings', description: '查询多个账本' })
  @UseGuards(new JwtAuthGuard(true))
  @UseInterceptors(ShareInterceptor)
  getBillings(@CurrentUser() user: User) {
    return this.billingService.getBillings(user.id);
  }

  @Query(() => Billing, {
    name: 'billing',
    description: '查询单个账本',
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
  @UseInterceptors(ShareInterceptor)
  getBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.billingService.getBilling(id, user.id);
  }

  @Mutation(() => Boolean, {
    description: '更新账本',
  })
  updateBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @Args('updateBillingInput') updateBillingInput: UpdateBillingInput,
  ) {
    return this.billingService.update(id, updateBillingInput);
  }

  @Mutation(() => Boolean, {
    description: '删除账本',
  })
  @UseGuards(JwtAuthGuard)
  removeBilling(
    @Args('id', { type: () => Int, description: '账本id' }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.billingService.remove(id, user.id);
  }

  @ResolveField('shares', () => [Share], {
    description: '分享',
    nullable: true,
  })
  getShares(@Parent() billing: Billing) {
    return this.billingLoader.getSharesByTargetId.load(billing.id);
  }

  @ResolveField('createdBy', () => User, {
    description: '创建人',
    nullable: true,
  })
  getCreatedBy(@Parent() billing: Billing) {
    return this.billingLoader.getCreatorById.load(billing.createdById);
  }
}
