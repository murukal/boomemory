import { CONNECTION_BOOMEMORY, Menu, Tenant } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { CreateMenuInput } from './dto/create-menu.input';
import { FilterMenuInput } from './dto/filter-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu, CONNECTION_BOOMEMORY)
    private readonly menuRepository: Repository<Menu>,

    @InjectRepository(Tenant, CONNECTION_BOOMEMORY)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * 创建菜单
   */
  async create(menu: CreateMenuInput) {
    return await this.menuRepository.save(this.menuRepository.create(menu));
  }

  /**
   * 查询多个菜单
   */
  async getMenus(query?: QueryParams<FilterMenuInput>) {
    return paginateQuery(this.menuRepository, query);
  }

  /**
   * 查询单个菜单
   */
  getMenu(id: number) {
    return this.menuRepository.findOne(id);
  }

  /**
   * 更新菜单
   */
  async update(id: number, menu: UpdateMenuInput) {
    return !!(
      await this.menuRepository
        .createQueryBuilder()
        .update()
        .whereInIds(id)
        .set({
          ...menu,
        })
        .execute()
    ).affected;
  }

  /**
   * 删除菜单
   */
  async remove(id: number) {
    return !!(
      await this.menuRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute()
    ).affected;
  }
}
