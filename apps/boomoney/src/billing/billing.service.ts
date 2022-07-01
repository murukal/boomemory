import { Billing, Share, UserProfile } from '@app/data-base/entities/boomoney';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppID } from 'utils/app/assets';
import { ShareService } from '../share/share.service';
import { CreateBillingInput } from './dto/create-billing.input';
import { SwitchDefaultArgs } from './dto/switch-default.args';
import { UpdateBillingInput } from './dto/update-billing.input';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing, AppID.Boomoney)
    private readonly billingRepository: Repository<Billing>,
    @InjectRepository(UserProfile, AppID.Boomoney)
    private readonly userProfileRepository: Repository<UserProfile>,
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
      .where('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere(
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

    // 删除分享
    // 账本创建人，删除当前账本的全部分享 -> 删除账本
    // 非账本创建人，仅删除当前账本的被分享条目即可
    await this.shareService.remove({
      targetId: id,
      targetType: TargetType.Billing,
      sharedById: isCreator ? undefined : userId,
    });

    if (!isCreator) return true;

    return !!(
      await this.billingRepository.update(id, {
        isDeleted: true,
      })
    ).affected;
  }

  /**
   * 切换默认账本
   * 切换账本是否默认
   */
  async switchDefault(switchDefaultArgs: SwitchDefaultArgs, userId: number) {
    let existed = await this.userProfileRepository.findOneBy({
      userId,
    });

    // 不存在用户信息则创建
    if (!existed) {
      existed = await this.userProfileRepository.save(
        this.userProfileRepository.create({
          userId,
        }),
      );
    }

    // 更新用户信息
    const isUpdated = !!(
      await this.userProfileRepository.update(userId, {
        defaultBillingId: switchDefaultArgs.isDefault
          ? switchDefaultArgs.id
          : null,
      })
    ).affected;

    // 返回默认的账本信息

    return isUpdated;
  }
}
