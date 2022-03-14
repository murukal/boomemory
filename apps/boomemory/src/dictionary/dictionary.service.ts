import { CONNECTION_BOOMEMORY, Dictionary } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary, CONNECTION_BOOMEMORY)
    private readonly dictionaryRepository: Repository<Dictionary>,
  ) {}

  create(dictionary: CreateDictionaryInput) {
    return this.dictionaryRepository.save(
      this.dictionaryRepository.create(dictionary),
    );
  }

  getDictionaries() {
    return this.dictionaryRepository.find();
  }

  getDictionay(id: number) {
    return this.dictionaryRepository.findOne(id);
  }

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
