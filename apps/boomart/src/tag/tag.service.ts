import { CONNECTION_BOOMART, Tag } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag, CONNECTION_BOOMART)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建标签
   */
  create(tag: CreateTagInput) {
    return this.tagRepository.save(this.tagRepository.create(tag));
  }

  /**
   * 查询多个标签
   */
  getTags(query?: QueryParams) {
    return paginateQuery(this.tagRepository, query);
  }

  /**
   * 查询单个标签
   */
  getTag(id: number) {
    return this.tagRepository.findOne(id);
  }

  /**
   * 更新标签
   */
  async update(id: number, tag: UpdateTagInput) {
    return !!(
      await this.tagRepository
        .createQueryBuilder()
        .update()
        .whereInIds(id)
        .set({
          ...tag,
        })
        .execute()
    ).affected;
  }

  /**
   * 创建标签
   */
  async remove(id: number) {
    return !!(
      await this.tagRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 查询榜单标签
   */
  getTopTags() {
    return this.tagRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.essays', 'essay')
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('COUNT(*)', 'creationCount')
      .groupBy('tag.id')
      .orderBy('creationCount', 'DESC')
      .limit(5)
      .execute();
  }
}
