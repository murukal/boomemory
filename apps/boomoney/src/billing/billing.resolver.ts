import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BillingService } from './billing.service';
import { Billing } from '../../../../libs/data-base/src/entities/boomoney/billing.entity';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';

@Resolver(() => Billing)
export class BillingResolver {
  constructor(private readonly billingService: BillingService) {}

  @Mutation(() => Billing, {
    description: '创建账本',
  })
  @UseGuards(JwtAuthGuard)
  createBilling(
    @Args('createBillingInput') createBillingInput: CreateBillingInput,
  ) {
    return this.billingService.create(createBillingInput);
  }

  @Query(() => [Billing], { name: 'billings', description: '查询多个账本' })
  @UseGuards(new JwtAuthGuard(true))
  getBillings() {
    return this.billingService.getBillings();
  }

  @Query(() => Billing, { name: 'billing', description: '查询单个账本' })
  @UseGuards(new JwtAuthGuard(true))
  getBilling(@Args('id', { type: () => Int }) id: number) {
    return this.billingService.getBilling(id);
  }

  @Mutation(() => Billing, {
    description: '更新账本',
  })
  updateBilling(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateBillingInput') updateBillingInput: UpdateBillingInput,
  ) {
    return this.billingService.update(id, updateBillingInput);
  }

  @Mutation(() => Billing, {
    description: '删除账本',
  })
  removeBilling(@Args('id', { type: () => Int }) id: number) {
    return this.billingService.remove(id);
  }
}
