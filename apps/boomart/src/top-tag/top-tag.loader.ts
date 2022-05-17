import { CONNECTION_BOOMART } from '@app/data-base/entities';
import { Tag } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader = require('dataloader');
import { Repository } from 'typeorm';
import { DailyHeat } from './dto/top-tag';

@Injectable()
export class TopTagLoader {
  constructor(
    @InjectRepository(Tag, CONNECTION_BOOMART)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  private from: Date;
  private to: Date;

  /**
   * 根据标签id获取日发布量
   */
  public getDailyHeatByTagId = new DataLoader<number, DailyHeat[]>(
    async (tagIds) => {
      const qb = this.tagRepository
        .createQueryBuilder('tag')
        .innerJoinAndSelect('tag.essays', 'essay')
        .select('tag.id', 'tagId')
        .addSelect("DATE_FORMAT(essay.createdAt, '%Y-%m-%d')", 'createdAtDate')
        .addSelect('COUNT(essay.id)', 'creationCount')
        .whereInIds(tagIds);

      // 起始
      if (this.from) {
        qb.andWhere('essay.createdAt >= :from', {
          from: this.from,
        });
      }

      // 截止
      if (this.to) {
        qb.andWhere('essay.createdAt <= :to', {
          to: this.to,
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

  /**
   * 设置事件范围
   */
  public setTimeRange(from?: Date, to?: Date) {
    this.from = from;
    this.to = to;
  }
}
