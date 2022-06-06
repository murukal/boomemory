import { Billing, Share } from '@app/data-base/entities/boomoney';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppID } from 'utils/app/assets';
import { ShareService } from '../share/share.service';
import { CreateBillingInput } from './dto/create-billing.input';
import { UpdateBillingInput } from './dto/update-billing.input';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing, AppID.Boomoney)
    private readonly billingRepository: Repository<Billing>,
    private readonly shareService: ShareService,
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
      .andWhere('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .where(
        '( billing.createdById = :userId OR share.sharedById = :userId )',
        {
          userId,
        },
      )
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
      .andWhere('isDeleted = :isDeleted', {
        isDeleted: false,
      })
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
   * 操作人为账本所有人，删除账本的所有分享，删除账本
   * 操作人非账本所有人，仅删除账本的相关分享
   */
  async remove(id: number, userId: number): Promise<boolean> {
    const billing = await this.billingRepository.findOneBy({
      id,
      isDeleted: false,
    });

    if (!billing) {
      return true;
    }

    const isCreator = billing.createdById === userId;

    const isShareRemoved = await this.shareService.remove({
      targetId: id,
      targetType: TargetType.Billing,
      sharedById: isCreator ? undefined : userId,
    });

    if (!isShareRemoved) return false;
    if (!isCreator) return true;

    return !!(
      await this.billingRepository.update(id, {
        isDeleted: true,
      })
    ).affected;
  }
}
