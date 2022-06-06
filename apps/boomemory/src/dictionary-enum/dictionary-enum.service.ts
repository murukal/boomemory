import { DictionaryEnum } from '@app/data-base/entities/boomemory/dictionary-enum.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';

@Injectable()
export class DictionaryEnumService {
  constructor(
    @InjectRepository(DictionaryEnum, AppID.Boomemory)
    private readonly dictionaryEnumRepository: Repository<DictionaryEnum>,
  ) {}

  /**
   * 创建字典枚举
   */
  create(dictionaryEnum: CreateDictionaryEnumInput) {
    return this.dictionaryEnumRepository.save(
      this.dictionaryEnumRepository.create(dictionaryEnum),
    );
  }

  /**
   * 分页查询字典枚举
   */
  getDictionaryEnums(query?: QueryParams) {
    return paginateQuery(this.dictionaryEnumRepository, query);
  }

  /**
   * 查询单个字典枚举
   */
  getDictionaryEnum(id: number) {
    return this.dictionaryEnumRepository.findOneBy({ id });
  }

  /**
   * 更新单个字典枚举
   */
  async update(id: number, dictionaryEnum: UpdateDictionaryEnumInput) {
    return !!(
      await this.dictionaryEnumRepository
        .createQueryBuilder()
        .update()
        .set({
          ...dictionaryEnum,
        })
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除单个字典枚举
   */
  async remove(id: number) {
    return !!(
      await this.dictionaryEnumRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
