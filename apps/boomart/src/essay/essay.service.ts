import { Essay, Tag } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app/assets';
import { CreateEssayInput } from './dto/create-essay.input';
import { FilterEssayInput } from './dto/filter-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';

@Injectable()
export class EssayService {
  constructor(
    @InjectRepository(Essay, AppID.Boomart)
    private readonly essayRepository: Repository<Essay>,
    @InjectRepository(Tag, AppID.Boomart)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建文章
   */
  async create(essay: CreateEssayInput, createdById: number) {
    const { tagIds, ...createEssayInput } = essay;

    // 读取创建后的文章
    const createdEssay = await this.essayRepository.save(
      this.essayRepository.create({
        ...createEssayInput,
        // 创作者
        createdById,
      }),
    );

    // 对已经创建的文章设置标签
    await this.essayRepository
      .createQueryBuilder()
      .relation('tags')
      .of(createdEssay.id)
      .add(tagIds);

    return createdEssay;
  }

  /**
   * 分页查询文章
   */
  async getEssays(query?: QueryParams<FilterEssayInput>) {
    const { paginateInput, filterInput } = query;
    // 提取筛选条件
    const { tagIds, ids, ...filter } = filterInput || {};

    // 根据标签id获取标签关联所有的文章id列表
    const tagEssayIds =
      tagIds &&
      (
        (await this.tagRepository
          .createQueryBuilder('tag')
          .innerJoinAndSelect('tag.essays', 'essay')
          .select('essay.id', 'essayId')
          .whereInIds(tagIds)
          .execute()) as {
          essayId: number;
        }[]
      ).map((essay) => essay.essayId);

    // 文章ids
    // 存在取交集
    const essayIds = ids
      ? tagEssayIds
        ? tagEssayIds.filter((id) => ids.includes(id))
        : ids
      : tagEssayIds;

    // 执行分页
    return paginateQuery(this.essayRepository, {
      paginateInput,
      filterInput: {
        ...filter,
        ...(essayIds && {
          id: In(essayIds),
        }),
      },
    });
  }

  /**
   * 查询单个文章
   */
  getEssay(id: number) {
    return this.essayRepository.findOneBy({ id });
  }

  /**
   * 更新文章
   */
  async update(id: number, essay: UpdateEssayInput) {
    const { tagIds, ...updateEssayInput } = essay;

    // 更新文章
    !!Object.keys(updateEssayInput).length &&
      (await this.essayRepository
        .createQueryBuilder()
        .update()
        .set(updateEssayInput)
        .whereInIds(id)
        .execute());

    // 更新关联的tagIds
    if (tagIds) {
      const tagQueryBuild = this.essayRepository
        .createQueryBuilder()
        .relation('tags')
        .of(id);

      await tagQueryBuild.addAndRemove(
        tagIds,
        (await tagQueryBuild.loadMany<Tag>()).map((tag) => tag.id),
      );
    }

    // 更新文章
    return true;
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
