import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BillingService } from './billing.service';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { Billing } from '@app/data-base/entities/boomoney';
import { User } from '@app/data-base/entities/boomemory';

@Resolver(() => Billing)
export class BillingResolver {
  constructor(private readonly billingService: BillingService) {}

  @Mutation(() => Billing, {
    description: '创建账本',
  })
  @UseGuards(JwtAuthGuard)
  createBilling(
    @Args('createBillingInput') createBillingInput: CreateBillingInput,
    @CurrentUser() user: User,
  ) {
    return this.billingService.create(createBillingInput, user.id);
  }

  @Query(() => [Billing], { name: 'billings', description: '查询多个账本' })
  @UseGuards(new JwtAuthGuard(true))
  getBillings(@CurrentUser() user: User) {
    return this.billingService.getBillings(user.id);
  }

  @Query(() => Billing, {
    name: 'billing',
    description: '查询单个账本',
    nullable: true,
  })
  @UseGuards(new JwtAuthGuard(true))
  getBilling(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.billingService.getBilling(id, user.id);
  }

  @Mutation(() => Boolean, {
    description: '更新账本',
  })
  updateBilling(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBillingInput') updateBillingInput: UpdateBillingInput,
  ) {
    return this.billingService.update(id, updateBillingInput);
  }

  @Mutation(() => Boolean, {
    description: '删除账本',
  })
  removeBilling(@Args('id', { type: () => Int }) id: number) {
    return this.billingService.remove(id);
  }
}
