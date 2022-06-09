import { Navigation, Tag } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app/assets';
import { TagService } from '../tag/tag.service';
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
    private readonly tagService: TagService,
  ) {}

  /**
   * 创建分类
   */
  async create(
    createNavigationInput: CreateNavigationInput,
    createdById: number,
  ): Promise<boolean> {
    const { tagIds, ...navigationInput } = createNavigationInput;

    // 获取tags
    const tags = (
      await this.tagService.getTags({
        filterInput: {
          ids: tagIds,
        },
      })
    ).items;

    return !!(await this.navigationRepository.save(
      this.navigationRepository.create({
        ...navigationInput,
        createdById,
        tags,
      }),
    ));
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
          .innerJoinAndSelect('tag.navigations', 'navigation')
          .select('navigation.id', 'navigationId')
          .whereInIds(tagIds)
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
  async update(
    id: number,
    updateNavigationInput: UpdateNavigationInput,
  ): Promise<boolean> {
    const { tagIds, ...navigationInput } = updateNavigationInput;

    // 获取tags
    const tags = (
      await this.tagService.getTags({
        filterInput: {
          ids: tagIds,
        },
      })
    ).items;

    // 覆盖原字段
    // 启用级联后，更新tags会自动更新关联表
    return !!(await this.navigationRepository.save({
      ...(await this.getNavigate(id)),
      ...navigationInput,
      tags,
    }));
  }

  /**
   * 删除导航
   */
  async remove(id: number) {
    return !!(await this.navigationRepository.delete(id)).affected;
  }
}
