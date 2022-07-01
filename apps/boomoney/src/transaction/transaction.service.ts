import { Transaction } from '@app/data-base/entities/boomoney';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app/assets';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { FilterTransactionInput } from './dto/filter-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction, AppID.Boomoney)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * 创建交易
   */
  create(createTransactionInput: CreateTransactionInput, createdById: number) {
    return this.transactionRepository.save(
      this.transactionRepository.create({
        ...createTransactionInput,
        createdById,
      }),
    );
  }

  /**
   * 查询多个交易
   */
  getTransactions(query?: QueryParams<FilterTransactionInput>) {
    const { filterInput, ...otherQuery } = query;
    const { directions, ...otherFilterInpu } = filterInput;

    return paginateQuery(this.transactionRepository, {
      ...otherQuery,
      filterInput: {
        ...otherFilterInpu,
        direction: In(directions),
      },
    });
  }

  /**
   * 查询单个交易
   */
  getTransaction(id: number) {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .whereInIds(id)
      .getOne();
  }

  /**
   * 更新交易
   */
  async update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return !!(
      await this.transactionRepository.update(id, updateTransactionInput)
    ).affected;
  }

  /**
   * 删除交易
   */
  async remove(id: number) {
    return !!(await this.transactionRepository.delete(id)).affected;
  }
}
