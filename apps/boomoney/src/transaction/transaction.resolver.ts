import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { User } from '@app/data-base/entities/boomemory';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guard';
import { Category, Transaction } from '@app/data-base/entities/boomoney';
import { PaginateInput } from 'utils/dto';
import { PaginatedTransactions } from './dto/paginated-transactions';
import { FilterTransactionInput } from './dto/filter-transaction.input';
import { TransactionLoader } from './transaction.loader';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionLoader: TransactionLoader,
  ) {}

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

  @Query(() => PaginatedTransactions, {
    name: 'transactions',
    description: '分页查询交易',
  })
  @UseGuards(JwtAuthGuard)
  getTransactions(
    @Args('filterInput', {
      type: () => FilterTransactionInput,
      description: '查询交易筛选条件',
    })
    filterInput: FilterTransactionInput,
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.transactionService.getTransactions({
      filterInput,
      paginateInput,
    });
  }

  @Query(() => Transaction, {
    name: 'transaction',
    description: '查询单个交易',
  })
  @UseGuards(JwtAuthGuard)
  getTransaction(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
  ) {
    return this.transactionService.getTransaction(id);
  }

  @Mutation(() => Boolean, {
    description: '更新交易',
  })
  updateTransaction(
    @Args('id', { type: () => Int, description: '交易id' }) id: number,
    @Args('updateTransactionInput', { description: '交易' })
    updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionService.update(id, updateTransactionInput);
  }

  @Mutation(() => Boolean)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }

  @ResolveField('category', () => Category, {
    description: '分类',
  })
  getCategory(@Parent() transaction: Transaction) {
    return this.transactionLoader.getCategoryById.load(transaction.categoryId);
  }

  @ResolveField('createdBy', () => User, {
    description: '交易创建人',
  })
  getCreatedBy(@Parent() transaction: Transaction) {
    return this.transactionLoader.getUserById.load(transaction.createdById);
  }
}
