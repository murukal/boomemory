import { Navigation } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app/assets';
import { CreateNavigationInput } from './dto/create-navigation.input';
import { UpdateNavigationInput } from './dto/update-navigation.input';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation, AppID.Boomart)
    private readonly navigationRepository: Repository<Navigation>,
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
  getNavigations(queryParams: QueryParams) {
    return paginateQuery(this.navigationRepository, queryParams);
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
