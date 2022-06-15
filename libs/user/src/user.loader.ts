import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoneyProfile } from './dto/money-profile';
import { UserProfile as UserMoneyProfile } from '@app/data-base/entities/boomoney';
import { AppID } from 'utils/app/assets';
import { MartProfile } from './dto/mart-profile';
import { Essay } from '@app/data-base/entities/boomart';
import { User } from '@app/data-base/entities/boomemory';

@Injectable()
export class UserLoader {
  constructor(
    @InjectRepository(User, AppID.Boomemory)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserMoneyProfile, AppID.Boomoney)
    private readonly userMoneyProfileRepository: Repository<UserMoneyProfile>,
    @InjectRepository(Essay, AppID.Boomart)
    private readonly essayRepository: Repository<Essay>,
  ) {}

  /**
   * 根据用户id获取money模块信息
   */
  public readonly getMoneyProfileById = new DataLoader<number, MoneyProfile>(
    async (userIds) => {
      const profiles = await this.userMoneyProfileRepository
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

  /**
   * 根据用户id获取mart模块信息
   */
  public readonly getMartProfileById = new DataLoader<number, MartProfile>(
    async (userIds: number[]) => {
      const creationCounts = (await this.essayRepository
        .createQueryBuilder()
        .select('COUNT(id)', 'count')
        .addSelect('createdById')
        .where('createdById IN (:...userIds)', {
          userIds,
        })
        .groupBy('createdById')
        .execute()) as {
        count: number;
        createdById: number;
      }[];

      return userIds.map<MartProfile>((userId) => ({
        creationCount:
          creationCounts.find((item) => item.createdById === userId).count || 0,
      }));
    },
  );

  /**
   * 根据用户id获取用户是否完成验证
   */
  public readonly getIsVerifiedById = new DataLoader<number, boolean>(
    async (userIds) => {
      const userProfiles = (await this.userRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.email', 'email')
        .select('user.id', 'userId')
        .addSelect('email.isVerified', 'isVerified')
        .whereInIds(userIds)
        .execute()) as {
        userId: number;
        isVerified: boolean;
      }[];

      return userIds.map(
        (userId) =>
          userProfiles.find((userProfile) => userProfile.userId === userId)
            .isVerified || false,
      );
    },
    {
      cache: false,
    },
  );
}
