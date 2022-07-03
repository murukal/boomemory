import { Transaction } from '@app/data-base/entities/boomoney';
import { Direction } from '@app/data-base/entities/boomoney/transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader = require('dataloader');
import { Repository } from 'typeorm';
import { AppID } from 'utils/app/assets';
import { TimeRangeInput } from 'utils/dto/time-range.input';

@Injectable()
export class CategoryLoader {
  constructor(
    @InjectRepository(Transaction, AppID.Boomoney)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * 根据分类id获取总支出
   */
  public readonly getTotalExpense = new DataLoader<
    { id: number } & TimeRangeInput,
    number
  >(
    async (args) => {
      const categoryIds = args.map((arg) => arg.id);
      const from = args[0].from || new Date();
      const to = args[0].to || new Date();

      const totalExpenses = (await this.transactionRepository
        .createQueryBuilder()
        .select('categoryId')
        .addSelect('SUM(amount)', 'amount')
        .where('categoryId IN (:...categoryIds)', {
          categoryIds,
        })
        .andWhere('direction = :direction', {
          direction: Direction.Out,
        })
        .andWhere('createdAt >= :from', {
          from,
        })
        .andWhere('createdAt <= :to', {
          to,
        })
        .groupBy('categoryId')
        .execute()) as {
        categoryId: number;
        amount: number;
      }[];

      return categoryIds.map(
        (categoryId) =>
          totalExpenses.find(
            (totalExpense) => totalExpense.categoryId === categoryId,
          )?.amount || 0,
      );
    },
    { cache: false },
  );
}
