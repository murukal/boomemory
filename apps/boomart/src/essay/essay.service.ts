import {
  CONNECTION_BOOMART,
  CONNECTION_BOOMEMORY,
  Essay,
  Tag,
  User,
} from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { CreateEssayInput } from './dto/create-essay.input';
import { FilterEssayInput } from './dto/filter-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';

@Injectable()
export class EssayService {
  constructor(
    @InjectRepository(Essay, CONNECTION_BOOMART)
    private readonly essayRepository: Repository<Essay>,

    @InjectRepository(Tag, CONNECTION_BOOMART)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(User, CONNECTION_BOOMEMORY)
    private readonly userRepository: Repository<User>,
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
   * 查询多个文章
   */
  async getEssays(query?: QueryParams<FilterEssayInput>) {
    const { paginateInput, filterInput } = query;
    // 提取筛选条件
    const { tagIds, ids, ...filter } = filterInput || {};

    // 按照tagId进行筛选
    const essayIds =
      tagIds &&
      (
        await this.essayRepository
          .createQueryBuilder('essay')
          .select('essay.id')
          .innerJoin('essay.tags', 'tag')
          .where('tag.id IN (:...tagIds)', {
            tagIds,
          })
          .getMany()
      ).map((essay) => essay.id);

    // 文章ids
    // const essayIds = ids ?

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

  /**
   * 查询创作者
   */
  async getCreatedBy(id: number) {
    return this.userRepository.findOne(
      (await this.essayRepository.findOne(id)).createdById,
    );
  }
}
