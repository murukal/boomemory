import { CONNECTION_BOOMONEY } from '@app/data-base/entities';
import { Category } from '@app/data-base/entities/boomoney';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category, CONNECTION_BOOMONEY)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建分类
   */
  create(createCategoryInput: CreateCategoryInput) {
    return this.categoryRepository.save(
      this.categoryRepository.create(createCategoryInput),
    );
  }

  /**
   * 查询多个分类
   */
  getCategories() {
    return this.categoryRepository.createQueryBuilder().getMany();
  }

  /**
   * 查询单个分类
   */
  getCategory(id: number) {
    return this.categoryRepository.findOneBy({
      id,
    });
  }

  /**
   * 更新分类
   */
  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    return !!(
      await this.categoryRepository.update(id, {
        ...updateCategoryInput,
      })
    ).affected;
  }

  /**
   * 删除分类
   */
  async remove(id: number) {
    return !!(await this.categoryRepository.delete(id)).affected;
  }
}
