import { Tag } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppID } from 'utils/application';
import { TopTag, TopTagArgs } from './dto/top-tag';

@Injectable()
export class TopTagService {
  constructor(
    @InjectRepository(Tag, APP_ID_BOOMART)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 查询榜单标签
   */
  async getTopTags(limit = 5, options: TopTagArgs) {
    const qb = this.tagRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.essays', 'essay')
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('COUNT(essay.id)', 'creationCount')
      .groupBy('tag.id')
      .orderBy('creationCount', 'DESC')
      .limit(limit)
      .where('1 = 1');

    if (options.from) {
      qb.andWhere('essay.createdAt >= :from', {
        from: options.from,
      });
    }

    if (options.to) {
      qb.andWhere('essay.createdAt <= :to', {
        to: options.to,
      });
    }

    return (await qb.execute()) as TopTag[];
  }
}
