import { DictionaryEnum } from '@app/data-base/entities/boomemory/dictionary-enum.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DictionaryEnumService } from './dictionary-enum.service';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';

@Resolver()
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}

  @Mutation(() => DictionaryEnum)
  createDictionaryEnum(
    @Args('createDictionaryEnumInput')
    dictionaryEnum: CreateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.create(dictionaryEnum);
  }

  @Query(() => [DictionaryEnum], { name: 'dictionaryEnums' })
  getDictionaryEnums() {
    return this.dictionaryEnumService.getDictionaryEnums();
  }

  @Query(() => DictionaryEnum, { name: 'dictionaryEnum' })
  getDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.getDictionaryEnum(id);
  }

  @Mutation(() => Boolean)
  updateDictionaryEnum(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDictionaryEnumInput')
    updateDictionaryEnumInput: UpdateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.update(id, updateDictionaryEnumInput);
  }

  @Mutation(() => Boolean)
  removeDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.remove(id);
  }
}
