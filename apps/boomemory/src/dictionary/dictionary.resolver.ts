import { Dictionary } from '@app/data-base/entities';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaginateInput } from 'utils/dto';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { DictionaryPaginateOutput } from './dto/dictionary-paginate.output';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary, { description: '创建字典' })
  createDictionary(
    @Args('createDictionaryInput') dictionary: CreateDictionaryInput,
  ) {
    return this.dictionaryService.create(dictionary);
  }

  @Query(() => DictionaryPaginateOutput, {
    name: 'dictionaries',
    description: '查询多个字典',
  })
  getDictionaries(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.dictionaryService.getDictionaries({
      paginateInput,
    });
  }

  @Query(() => Dictionary, { name: 'dictionary', description: '查询单个字典' })
  getDictionay(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.getDictionay(id);
  }

  @Mutation(() => Boolean, { description: '更新字典' })
  updateDictionary(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDictionaryInput') updateDictionaryInput: UpdateDictionaryInput,
  ) {
    return this.dictionaryService.update(id, updateDictionaryInput);
  }

  @Mutation(() => Boolean, { description: '删除字典' })
  removeDictionary(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.remove(id);
  }
}
