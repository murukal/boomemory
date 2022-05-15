import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoneyProfile } from './dto/money-profile';
import { UserProfile } from '@app/data-base/entities/boomoney';

@Injectable()
export class AuthLoader {
  constructor(
    @InjectRepository(UserProfile, CONNECTION_BOOMONEY)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * 根据用户Id获取信息
   */
  public readonly getMoneyProfileById = new DataLoader<number, MoneyProfile>(
    async (userIds) => {
      const profiles = await this.userProfileRepository
        .createQueryBuilder('profile')
        .innerJoinAndMapOne(
          'profile.defaultBilling',
          'profile.defaultBilling',
          'billing',
        )
        .whereInIds(userIds)
        .getMany();

      return userIds.map((userId) =>
        profiles.find((profile) => profile.userId === userId),
      );
    },
  );
}
