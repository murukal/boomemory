import { CONNECTION_BOOMART, Essay, Tag } from '@app/data-base/entities';
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

    @InjectRepository(Tag, CONNECTION_BOOMART)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建文章
   */
  async create(essay: CreateEssayInput) {
    const createEssayInput = {
      ...essay,

      // 关联的tags
      ...(essay.tagIds && {
        tags: await this.tagRepository.findByIds(essay.tagIds),
      }),
    };

    return this.essayRepository.save(
      this.essayRepository.create(createEssayInput),
    );
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
    const updateEssayInput = {
      ...essay,

      // 关联的tags
      ...(essay.tagIds && {
        tags: await this.tagRepository.findByIds(essay.tagIds),
      }),
    };

    return !!(
      await this.essayRepository
        .createQueryBuilder()
        .update()
        .set(updateEssayInput)
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

  /**
   * 查询文章的tags
   */
  async getTags(id: number) {
    return (
      await this.essayRepository.findOne(id, {
        relations: ['tags'],
      })
    ).tags;
  }

  /**
   * 查询文章的tagIds
   */
  async getTagIds(id: number) {
    return (await this.getTags(id)).map((tag) => tag.id);
  }
}
