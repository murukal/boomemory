import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Share } from '@app/data-base/entities/boomoney';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader = require('dataloader');
import { Repository } from 'typeorm';

@Injectable()
export class BillingLoader {
  private targetType: TargetType;

  constructor(
    @InjectRepository(Share, CONNECTION_BOOMONEY)
    private readonly shareRepository: Repository<Share>,
  ) {}

  /**
   * 根据账本id获取分享信息
   */
  public readonly getSharesByTargetId = new DataLoader<number, Share[]>(
    async (targetIds: number[]) => {
      const shares = await this.shareRepository
        .createQueryBuilder()
        .where('targetType = :targetType', {
          targetType: this.targetType,
        })
        .andWhere('targetId IN (:...targetIds)', {
          targetIds,
        })
        .getMany();

      const groupedShares = shares.reduce<Record<number, Share[]>>(
        (prev, share) => {
          if (prev[share.targetId]) {
            prev[share.targetId].push(share);
          } else {
            prev[share.targetId] = [share];
          }

          return prev;
        },
        {},
      );

      return targetIds.map((targetId) => groupedShares[targetId]);
    },
  );

  /**
   * target type
   */
  public setTargetType(targetType?: TargetType) {
    this.targetType = targetType;
  }
}