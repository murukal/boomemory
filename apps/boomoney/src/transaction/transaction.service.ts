import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Share, Transaction } from '@app/data-base/entities/boomoney';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction, CONNECTION_BOOMONEY)
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
  getTransactions(userId: number, billingId: number) {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = transaction.id',
        {
          targetType: TargetType.Transaction,
        },
      )
      .where(
        '( transaction.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
      .andWhere('transaction.billingId = :billingId', {
        billingId,
      })
      .getMany();
  }

  /**
   * 查询单个交易
   */
  getTransaction(id: number, userId: number) {
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = transaction.id',
        {
          targetType: TargetType.Transaction,
        },
      )
      .whereInIds(id)
      .andWhere(
        '( transaction.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
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
