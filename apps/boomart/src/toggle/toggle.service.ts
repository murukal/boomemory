import { CONNECTION_BOOMART, Toggle } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TargetType } from 'utils/dto/toggle-enum';
import { CreateToggleInput } from './dto/create-toggle.input';
import { TopInput } from './dto/top-essays.input';

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
   * 获取榜单
   */
  getTopTargets(targetType: TargetType, topInput: TopInput) {
    const top = this.toggleRepository
      .createQueryBuilder()
      .select('targetId')
      .addSelect('COUNT(*)', 'count')
      .where('targetType = :targetType', { targetType })
      .andWhere('type = :type', {
        type: topInput.type,
      })
      .take(topInput.limit)
      .execute();

    return [];
  }
}
