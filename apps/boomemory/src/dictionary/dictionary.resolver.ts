import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DictionaryService } from './dictionary.service';
import { Dictionary } from '../../../../libs/data-base/src/entities/boomemory/dictionary.entity';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary)
  createDictionary(
    @Args('createDictionaryInput') dictionary: CreateDictionaryInput,
  ) {
    return this.dictionaryService.create(dictionary);
  }

  @Query(() => [Dictionary], { name: 'dictionaries' })
  getDictionaries() {
    return this.dictionaryService.getDictionaries();
  }

  @Query(() => Dictionary, { name: 'dictionary' })
  getDictionay(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.getDictionay(id);
  }

  @Mutation(() => Boolean)
  updateDictionary(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDictionaryInput') updateDictionaryInput: UpdateDictionaryInput,
  ) {
    return this.dictionaryService.update(id, updateDictionaryInput);
  }

  @Mutation(() => Boolean)
  removeDictionary(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.remove(id);
  }
}
