import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoneyProfile } from './dto/money-profile';
import { UserProfile } from '@app/data-base/entities/boomoney';
import { AppID } from 'utils/app';

@Injectable()
export class AuthLoader {
  constructor(
    @InjectRepository(UserProfile, AppID.Boomoney)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  /**
   * 根据用户Id获取money模块信息
   */
  public readonly getMoneyProfileById = new DataLoader<number, MoneyProfile>(
    async (userIds) => {
      const profiles = await this.userProfileRepository
        .createQueryBuilder('profile')
        .leftJoinAndMapOne(
          'profile.defaultBilling',
          'profile.defaultBilling',
          'billing',
          'billing.isDeleted = :isDeleted',
          {
            isDeleted: false,
          },
        )
        .whereInIds(userIds)
        .getMany();

      return userIds.map((userId) =>
        profiles.find((profile) => profile.userId === userId),
      );
    },
  );
}
