import { CONNECTION_BOOMART, Toggle } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetType, Type } from 'utils/dto/toggle-enum';
import { CreateToggleInput } from './dto/create-toggle.input';
import { TopInput } from './dto/top.input';

@Injectable()
export class ToggleService {
  constructor(
    @InjectRepository(Toggle, CONNECTION_BOOMART)
    private readonly toggleRepository: Repository<Toggle>,
  ) {}

  /**
   * 创建触发事件
   */
  create(toggle: CreateToggleInput, createdById) {
    return this.toggleRepository.save(
      this.toggleRepository.create({
        ...toggle,
        createdById,
      }),
    );
  }

  /**
   * 删除触发事件
   */
  async remove(id: number) {
    return !!(
      await this.toggleRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
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
  async getTargetTopIds(topInput: TopInput) {
    return (
      await this.toggleRepository
        .createQueryBuilder()
        .select('targetId')
        .addSelect('COUNT(id)', 'count')
        .where('targetType = :targetType', { targetType: topInput.targetType })
        .andWhere('type = :type', {
          type: topInput.type,
        })
        .groupBy('targetId')
        .orderBy('count', 'DESC')
        .take(topInput.limit)
        .execute()
    ).map((item: { targetId: number; count: string }) => item.targetId);
  }
}
