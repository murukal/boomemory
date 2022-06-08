import { Navigation, Tag } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader = require('dataloader');
import { Repository } from 'typeorm';
import { AppID } from 'utils/app/assets';

@Injectable()
export class NavigationLoader {
  constructor(
    @InjectRepository(Navigation, AppID.Boomart)
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  /**
   * 根据导航id获取导航对应的标签列表
   */
  public readonly getTagsByNavigationId = new DataLoader<number, Tag[]>(
    async (ids: number[]) => {
      const navigations = await this.navigationRepository
        .createQueryBuilder('navigation')
        .leftJoinAndMapMany('navigation.tags', 'navigation.tags', 'tag')
        .whereInIds(ids)
        .getMany();

      return ids.map((id) => navigations.find((tag) => tag.id === id).tags);
    },
  );
}
