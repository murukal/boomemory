import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { CONNECTION_BOOMART } from '@app/data-base/entities';
import { Essay, Tag } from '@app/data-base/entities/boomart';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthLoader {
  constructor(
    @InjectRepository(Essay, CONNECTION_BOOMART)
    private readonly essayRepository: Repository<Essay>,
  ) {}

  /**
   * 根据文章id读取文章对应的标签
   */
  public readonly getMoneyProfileById = new DataLoader<number, Tag[]>(
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
}
