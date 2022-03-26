import { CONNECTION_BOOMART, Toggle } from '@app/data-base/entities';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetType, Type } from 'utils/dto/toggle-enum';
import { EssayService } from '../essay/essay.service';
import { CreateToggleInput } from './dto/create-toggle.input';
import { RemoveToggleInput } from './dto/remove-toggle.input';
import { TopInput } from './dto/top.input';

@Injectable()
export class ToggleService {
  constructor(
    @InjectRepository(Toggle, CONNECTION_BOOMART)
    private readonly toggleRepository: Repository<Toggle>,

    @Inject(forwardRef(() => EssayService))
    private readonly essayService: EssayService,
  ) {}

  /**
   * 创建触发事件
   */
  async create(toggle: CreateToggleInput, createdById: number) {
    return !!(await this.toggleRepository.save(
      this.toggleRepository.create({
        ...toggle,
        createdById,
      }),
    ));
  }

  /**
   * 删除触发事件
   */
  async remove(removeToggleInput: RemoveToggleInput, createdById: number) {
    return !!(
      await this.toggleRepository
        .createQueryBuilder()
        .delete()
        .where('targetId = :targetId', { targetId: removeToggleInput.targetId })
        .andWhere('targetType = :targetType', {
          targetType: removeToggleInput.targetType,
        })
        .andWhere('type = :type', { type: removeToggleInput.type })
        .andWhere('createdById = :createdById', { createdById })
        .execute()
    ).affected;
  }

  /**
   * 获取流量
   */
  getClout(type: Type, targetType: TargetType, targetId: number) {
    return this.toggleRepository
      .createQueryBuilder()
      .where('type = :type', {
        type,
      })
      .andWhere('targetType = :targetType', {
        targetType,
      })
      .andWhere('targetId = :targetId', {
        targetId,
      })
      .getCount();
  }

  /**
   * 获取榜单ids
   */
  async getTopTargetIds(targetType: TargetType, topInput: TopInput) {
    return (
      await this.toggleRepository
        .createQueryBuilder()
        .select('targetId')
        .addSelect('COUNT(id)', 'count')
        .where('targetType = :targetType', { targetType })
        .andWhere('type = :type', {
          type: topInput.type,
        })
        .andWhere('createdAt >= :from', {
          from: topInput.from,
        })
        .andWhere('createdAt <= :to', {
          to: topInput.to,
        })
        .groupBy('targetId')
        .orderBy('count', 'DESC')
        .take(topInput.limit)
        .execute()
    ).map((item: { targetId: number; count: string }) => {
      return item.targetId;
    });
  }

  /**
   * 获取榜单目标
   */
  async getTopEssays(topInput: TopInput) {
    const ids = await this.getTopTargetIds(TargetType.essay, topInput);

    return (
      await this.essayService.getEssays({
        filterInput: {
          ids,
        },
      })
    ).items;
  }
}
