import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Share } from '@app/data-base/entities/boomoney';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShareInput } from './dto/create-share.input';
import { RemoveShareInput } from './dto/remove-share.input';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share, CONNECTION_BOOMONEY)
    private readonly shareRepository: Repository<Share>,
  ) {}

  /**
   * 分享
   */
  async create(createShareInput: CreateShareInput): Promise<boolean> {
    const isRemoved = await this.remove({
      targetType: createShareInput.targetType,
      targetId: createShareInput.targetId,
    });

    // 删除原来的分享失败，直接返回
    if (!isRemoved) return false;

    const createdShares = await this.shareRepository.save(
      createShareInput.sharedByIds.map((sharedById) =>
        this.shareRepository.create({
          sharedById,
          targetId: createShareInput.targetId,
          targetType: createShareInput.targetType,
        }),
      ),
    );

    return !!createdShares.length;
  }

  /**
   * 删除分享
   */
  async remove(removeShareInput: RemoveShareInput): Promise<boolean> {
    const qb = this.shareRepository
      .createQueryBuilder()
      .delete()
      .where('targetId = :targetId', {
        targetId: removeShareInput.targetId,
      })
      .andWhere('targetType = :targetType', {
        targetType: removeShareInput.targetType,
      });

    if (removeShareInput.sharedById) {
      qb.andWhere('sharedById = :sharedById', {
        sharedById: removeShareInput.sharedById,
      });
    }

    const { affected } = await qb.execute();

    return !!affected;
  }
}
