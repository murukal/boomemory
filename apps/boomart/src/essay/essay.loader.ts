import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { Essay, Tag, Toggle } from '@app/data-base/entities/boomart';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CONNECTION_BOOMART } from '@app/data-base/entities';
import { User } from '@app/data-base/entities/boomemory';
import { UserService } from '@app/user';
import {
  TargetType,
  Type,
} from '@app/data-base/entities/boomart/toggle.entity';

interface cloutProfile {
  targetId: number;
  clout: number;
}

@Injectable()
export class EssayLoader {
  private userId: number;

  constructor(
    @InjectRepository(Essay, CONNECTION_BOOMART)
    private readonly essayRepository: Repository<Essay>,
    @InjectRepository(Toggle, CONNECTION_BOOMART)
    private readonly toggleRepository: Repository<Toggle>,
    private readonly userService: UserService,
  ) {}

  /**
   * 根据文章id读取文章对应的标签
   */
  public readonly getTagsByEssayId = new DataLoader<number, Tag[]>(
    async (essayIds) => {
      const essays = await this.essayRepository
        .createQueryBuilder('essay')
        .innerJoinAndMapMany('essay.tags', 'essay.tags', 'tag')
        .whereInIds(essayIds)
        .getMany();

      return essayIds.map(
        (essayId) => essays.find((essay) => essay.id === essayId).tags,
      );
    },
  );

  /**
   * 根据用户id获取用户信息
   */
  public readonly getUserById = new DataLoader<number, User>(
    async (userIds: number[]) => {
      return await this.userService.getUsers4UserIds(userIds);
    },
  );

  /**
   * 根据文章id获取浏览量
   */
  public readonly getBrowseCloutById = new DataLoader<number, number>(
    async (essayIds: number[]) => {
      const clouts = await this.getClouts4Targets(
        Type.Browse,
        TargetType.Essay,
        essayIds,
      );

      return essayIds.map(
        (essayId) =>
          clouts.find((clout) => clout.targetId === essayId)?.clout || 0,
      );
    },
  );

  /**
   * 根据文章id获取点赞量
   */
  public readonly getLikeCloutById = new DataLoader<number, number>(
    async (essayIds: number[]) => {
      const clouts = await this.getClouts4Targets(
        Type.Like,
        TargetType.Essay,
        essayIds,
      );

      return essayIds.map(
        (essayId) =>
          clouts.find((clout) => clout.targetId === essayId)?.clout || 0,
      );
    },
  );

  /**
   * 根据文章id获取收藏量
   */
  public readonly getCollectCloutById = new DataLoader<number, number>(
    async (essayIds: number[]) => {
      const clouts = await this.getClouts4Targets(
        Type.Collect,
        TargetType.Essay,
        essayIds,
      );

      return essayIds.map(
        (essayId) =>
          clouts.find((clout) => clout.targetId === essayId)?.clout || 0,
      );
    },
  );

  /**
   * 根据文章id获取是否被点赞
   */
  public readonly getIsLikedById = new DataLoader<number, boolean>(
    async (essayIds: number[]) => {
      const clouts = await this.getClouts4Targets(
        Type.Like,
        TargetType.Essay,
        essayIds,
        this.userId || 0,
      );

      return essayIds.map(
        (essayId) =>
          !!clouts.find((clout) => clout.targetId === essayId)?.clout,
      );
    },
  );

  /**
   * 根据文章id获取是否被收藏
   */
  public readonly getIsCollectedById = new DataLoader<number, boolean>(
    async (essayIds: number[]) => {
      const clouts = await this.getClouts4Targets(
        Type.Collect,
        TargetType.Essay,
        essayIds,
        this.userId || 0,
      );

      return essayIds.map(
        (essayId) =>
          !!clouts.find((clout) => clout.targetId === essayId)?.clout,
      );
    },
  );

  /**
   * 设置用户id
   */
  public setUserId(userId: number) {
    this.userId = userId;
  }

  /**
   * 获取目标流量
   */
  private getClouts4Targets(
    type: Type,
    targetType: TargetType,
    targetIds: number[],
    createdById?: number,
  ): Promise<cloutProfile[]> {
    const qb = this.toggleRepository
      .createQueryBuilder()
      .select('targetId')
      .addSelect('COUNT(id)', 'clout')
      .where('type = :type', {
        type,
      })
      .andWhere('targetType = :targetType', {
        targetType,
      })
      .andWhere('targetId IN (:...targetIds)', {
        targetIds,
      });

    // 用户id为数字时，添加筛选条件
    if (!isNaN(createdById)) {
      qb.andWhere('createdById = :createdById', {
        createdById,
      });
    }

    return qb.execute();
  }
}
