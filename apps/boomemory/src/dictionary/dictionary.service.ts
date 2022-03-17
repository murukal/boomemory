import { CONNECTION_BOOMEMORY, Dictionary } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary, CONNECTION_BOOMEMORY)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  /**
   * 创建字典
   */
  create(dictionary: CreateDictionaryInput) {
    return this.dictionaryRepository.save(
      this.dictionaryRepository.create(dictionary),
    );
  }

  /**
   * 查询多个字典
   */
  getDictionaries(query?: QueryParams) {
    return paginateQuery(this.dictionaryRepository, query);
  }

  /**
   * 查询单个字典
   */
  getDictionay(id: number) {
    return this.dictionaryRepository.findOne(id);
  }

  /**
   * 更新字典
   */
  async update(id: number, dictionary: UpdateDictionaryInput) {
    return !!(
      await this.dictionaryRepository
        .createQueryBuilder()
        .update()
        .set({
          ...dictionary,
        })
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除字典
   */
  async remove(id: number) {
    return !!(
      await this.dictionaryRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
