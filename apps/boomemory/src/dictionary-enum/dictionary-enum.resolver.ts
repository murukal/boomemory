import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DictionaryEnumService } from './dictionary-enum.service';
import { DictionaryEnum } from './entities/dictionary-enum.entity';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';

@Resolver(() => DictionaryEnum)
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}

  @Mutation(() => DictionaryEnum)
  createDictionaryEnum(@Args('createDictionaryEnumInput') createDictionaryEnumInput: CreateDictionaryEnumInput) {
    return this.dictionaryEnumService.create(createDictionaryEnumInput);
  }

  @Query(() => [DictionaryEnum], { name: 'dictionaryEnum' })
  findAll() {
    return this.dictionaryEnumService.findAll();
  }

  @Query(() => DictionaryEnum, { name: 'dictionaryEnum' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.findOne(id);
  }

  @Mutation(() => DictionaryEnum)
  updateDictionaryEnum(@Args('updateDictionaryEnumInput') updateDictionaryEnumInput: UpdateDictionaryEnumInput) {
    return this.dictionaryEnumService.update(updateDictionaryEnumInput.id, updateDictionaryEnumInput);
  }

  @Mutation(() => DictionaryEnum)
  removeDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.remove(id);
  }
}
