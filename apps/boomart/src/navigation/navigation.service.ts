import { Navigation, Tag } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app/assets';
import { CreateNavigationInput } from './dto/create-navigation.input';
import { FilterNavigationInput } from './dto/filter-navigation.input';
import { UpdateNavigationInput } from './dto/update-navigation.input';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation, AppID.Boomart)
    private readonly navigationRepository: Repository<Navigation>,
    @InjectRepository(Tag, AppID.Boomart)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建分类
   */
  create(createNavigationInput: CreateNavigationInput) {
    return this.navigationRepository.save(
      this.navigationRepository.create(createNavigationInput),
    );
  }

  /**
   * 分页查询导航
   */
  async getNavigations(query?: QueryParams<FilterNavigationInput>) {
    const { filterInput, ...otherQuery } = query || {};
    const { tagIds, ...otherFilterInput } = filterInput || {};

    // 根据标签id获取标签关联所有的导航id列表
    const navigationIds =
      tagIds &&
      (
        (await this.tagRepository
          .createQueryBuilder('tag')
          .innerJoinAndSelect(Navigation, 'navigation')
          .whereInIds(tagIds)
          .select('navigation.id', 'navigationId')
          .execute()) as {
          navigationId: number;
        }[]
      ).map((navigation) => navigation.navigationId);

    // 分页查询
    return paginateQuery(this.navigationRepository, {
      ...otherQuery,
      filterInput: {
        ...otherFilterInput,
        ...(navigationIds && {
          id: In(navigationIds),
        }),
      },
    });
  }

  /**
   * 查询单个导航
   */
  getNavigate(id: number) {
    return this.navigationRepository.findOneBy({
      id,
    });
  }

  /**
   * 更新导航
   */
  update(id: number, updateNavigationInput: UpdateNavigationInput) {
    return this.navigationRepository.update(id, updateNavigationInput);
  }

  /**
   * 删除导航
   */
  remove(id: number) {
    return this.navigationRepository.delete(id);
  }
}
