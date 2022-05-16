import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { User } from '@app/data-base/entities/boomemory';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { Transaction } from '@app/data-base/entities/boomoney';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction, {
    description: '创建交易',
  })
  @UseGuards(JwtAuthGuard)
  createTransaction(
    @Args('createTransactionInput', {
      description: '交易',
    })
    createTransactionInput: CreateTransactionInput,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.create(createTransactionInput, user.id);
  }

  @Query(() => [Transaction], {
    name: 'transactions',
    description: '查询多个交易',
  })
  @UseGuards(new JwtAuthGuard(true))
  getTransactions(
    @Args('billingId', { type: () => Int, description: '账本ID' })
    billingId: number,
    @CurrentUser()
    user: User,
  ) {
    return this.transactionService.getTransactions(user.id, billingId);
  }

  @Query(() => Transaction, {
    name: 'transaction',
    description: '查询单个交易',
  })
  getTransaction(
    @Args('id', { type: () => Int, description: '交易ID' }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.getTransaction(id, user.id);
  }

  @Mutation(() => Boolean, {
    description: '更新交易',
  })
  updateTransaction(
    @Args('id', { type: () => Int, description: '交易ID' }) id: number,
    @Args('updateTransactionInput', { description: '交易' })
    updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionService.update(id, updateTransactionInput);
  }

  @Mutation(() => Boolean)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }
}
