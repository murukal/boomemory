import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { CONNECTION_BOOMART } from '@app/data-base/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyHeat } from './dto/top-tag';
import { Tag } from '@app/data-base/entities/boomart';

@Injectable()
export class TagLoader {
  /**
   * 根据标签id获取日发布量
   */
  public getDailyHeatByTagId: DataLoader<number, DailyHeat[]> | undefined;

  constructor(
    @InjectRepository(Tag, CONNECTION_BOOMART)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 初始化 getDailyHeatByTagId DataLoader
   */
  initializeGetDailyHeatByTagId(from?: Date, to?: Date) {
    this.getDailyHeatByTagId = new DataLoader<number, DailyHeat[]>(
      async (tagIds) => {
        const qb = this.tagRepository
          .createQueryBuilder('tag')
          .innerJoinAndSelect('tag.essays', 'essay')
          .select('tag.id', 'tagId')
          .addSelect(
            "DATE_FORMAT(essay.createdAt, '%Y-%m-%d')",
            'createdAtDate',
          )
          .addSelect('COUNT(essay.id)', 'creationCount')
          .whereInIds(tagIds);

        // 起始
        if (from) {
          qb.andWhere('essay.createdAt >= :from', {
            from,
          });
        }

        // 截止
        if (to) {
          qb.andWhere('essay.createdAt <= :to', {
            to,
          });
        }

        const tagDailyCounts = (await qb
          .groupBy('tag.id')
          .addGroupBy('createdAtDate')
          .execute()) as ({
          tagId: number;
        } & DailyHeat)[];

        return tagDailyCounts.reduce(
          (prev, tagDailyCount) => {
            const index = tagIds.indexOf(tagDailyCount.tagId);

            prev[index].push({
              createdAtDate: tagDailyCount.createdAtDate,
              creationCount: tagDailyCount.creationCount,
            });

            return prev;
          },
          tagIds.map<DailyHeat[]>(() => []),
        );
      },
    );

    return true;
  }
}
