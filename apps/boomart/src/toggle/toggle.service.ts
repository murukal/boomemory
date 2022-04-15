import { CONNECTION_BOOMART, Toggle } from '@app/data-base/entities';
import {
  TargetType,
  Type,
} from '@app/data-base/entities/boomart/toggle.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EssayService } from '../essay/essay.service';
import { CreateToggleInput } from './dto/create-toggle.input';
import { DailyClout, DailyCloutArgs } from './dto/daily-clout.args';
import { RemoveToggleInput } from './dto/remove-toggle.input';
import { TopInput } from './dto/top.input';

@Injectable()
export class ToggleService {
  constructor(
    @InjectRepository(Toggle, CONNECTION_BOOMART)
    private readonly toggleRepository: Repository<Toggle>,
    private readonly essayService: EssayService,
  ) {}

  /**
   * 创建触发事件
   */
  async create(toggle: CreateToggleInput, createdById: number) {
    // 事件类型需要鉴权
    if (![Type.Browse].includes(toggle.type) && !createdById) {
      throw new UnauthorizedException('用户未登录！');
    }

    // 事件类型不可二次创建
    if (
      ![Type.Browse].includes(toggle.type) &&
      (await this.toggleRepository.countBy({
        ...toggle,
        createdById,
      }))
    ) {
      return true;
    }

    // 创建事件
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
   * 获取目标流量
   */
  getClout4Target(type: Type, targetType: TargetType, targetId: number) {
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
      (await this.toggleRepository
        .createQueryBuilder()
        .select('targetId')
        .addSelect('COUNT(id)', 'count')
        .where({ targetType, type: topInput.type })
        .andWhere({
          createdAt: MoreThanOrEqual(topInput.from),
        })
        .andWhere({
          createdAt: LessThanOrEqual(topInput.to),
        })
        .groupBy('targetId')
        .orderBy('count', 'DESC')
        .take(topInput.limit)
        .execute()) as { targetId: number; count: string }[]
    ).map((top) => {
      return top.targetId;
    });
  }

  /**
   * 获取榜单目标
   */
  async getTopEssays(topInput: TopInput) {
    const ids = await this.getTopTargetIds(TargetType.Essay, topInput);

    return (
      await this.essayService.getEssays({
        filterInput: {
          ids,
        },
      })
    ).items;
  }

  /**
   * 获取指定时间范围内的流量
   * 并按照日期进行分组
   */
  async getDailyClout(dailyCloutArgs?: DailyCloutArgs) {
    return (await this.toggleRepository
      .createQueryBuilder()
      .where({
        type: dailyCloutArgs.type,
        targetType: dailyCloutArgs.targetType,
      })
      .andWhere({
        createdAt: MoreThanOrEqual(dailyCloutArgs.from),
      })
      .andWhere({
        createdAt: LessThanOrEqual(dailyCloutArgs.to),
      })
      .select("DATE_FORMAT(createdAt, '%Y-%m-%d')", 'createdAtDate')
      .addSelect('COUNT(id)', 'clout')
      .groupBy('createdAtDate')
      .execute()) as DailyClout[];
  }
}
