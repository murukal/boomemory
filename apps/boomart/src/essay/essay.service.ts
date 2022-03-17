import { CONNECTION_BOOMART, Essay } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { CreateEssayInput } from './dto/create-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';

@Injectable()
export class EssayService {
  constructor(
    @InjectRepository(Essay, CONNECTION_BOOMART)
    private readonly essayRepository: Repository<Essay>,
  ) {}

  /**
   * 创建文章
   */
  create(essay: CreateEssayInput) {
    return this.essayRepository.save(this.essayRepository.create(essay));
  }

  /**
   * 查询多个文章
   */
  getEssays(query?: QueryParams) {
    return paginateQuery(this.essayRepository, query);
  }

  /**
   * 查询单个文章
   */
  getEssay(id: number) {
    return this.essayRepository.findOne(id);
  }

  /**
   * 更新文章
   */
  async update(id: number, essay: UpdateEssayInput) {
    return !!(
      await this.essayRepository
        .createQueryBuilder()
        .update()
        .set({
          ...essay,
        })
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除文章
   */
  async remove(id: number) {
    return !!(
      await this.essayRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
