import { Injectable } from '@nestjs/common';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';

@Injectable()
export class DictionaryEnumService {
  create(createDictionaryEnumInput: CreateDictionaryEnumInput) {
    return 'This action adds a new dictionaryEnum';
  }

  findAll() {
    return `This action returns all dictionaryEnum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dictionaryEnum`;
  }

  update(id: number, updateDictionaryEnumInput: UpdateDictionaryEnumInput) {
    return `This action updates a #${id} dictionaryEnum`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictionaryEnum`;
  }
}
