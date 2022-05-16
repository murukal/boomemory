import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Share } from '@app/data-base/entities/boomoney';
import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share, CONNECTION_BOOMONEY)
    private readonly shareRepository: Repository<Share>,
  ) {}

  /**
   * 分享
   */
  async create(targetId: number, targetType: TargetType, userIds: number[]) {
    const createdShares = await this.shareRepository.save(
      userIds.map((userId) =>
        this.shareRepository.create({
          sharedById: userId,
          targetId,
          targetType,
        }),
      ),
    );

    return !!createdShares.length;
  }
}
