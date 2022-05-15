import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Billing, Share } from '@app/data-base/entities/boomoney';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing, CONNECTION_BOOMONEY)
    private readonly billingRepository: Repository<Billing>,
  ) {}

  /**
   * 创建账本
   */
  create(createBillingInput: CreateBillingInput, createdById: number) {
    return this.billingRepository.save(
      this.billingRepository.create({
        ...createBillingInput,
        createdById,
      }),
    );
  }

  /**
   * 查询多个账本
   */
  async getBillings(userId: number) {
    return await this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      )
      .where('billing.createdById = :userId OR share.sharedById = :userId', {
        userId,
      })
      .getMany();
  }

  /**
   * 查询单个账本
   */
  getBilling(billingId: number, userId: number) {
    return this.billingRepository
      .createQueryBuilder('billing')
      .leftJoinAndSelect(
        Share,
        'share',
        'share.targetType = :targetType AND share.targetId = billing.id',
        {
          targetType: TargetType.Billing,
        },
      )
      .whereInIds(billingId)
      .andWhere(
        '( billing.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
      .getOne();
  }

  /**
   * 更新账本信息
   */
  update(id: number, updateBillingInput: UpdateBillingInput) {
    return this.billingRepository.update(id, updateBillingInput);
  }

  /**
   * 删除账本信息
   */
  remove(id: number) {
    return this.billingRepository.delete(id);
  }
}
