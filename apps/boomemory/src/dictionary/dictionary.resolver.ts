import { Dictionary } from '@app/data-base/entities';
import { AuthorizationActionCode } from '@app/data-base/entities/boomemory/authorization-action.entity';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Permission } from 'utils/decorator/permission.decorator';
import { PaginateInput } from 'utils/dto';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryInput } from './dto/create-dictionary.input';
import { PaginatedDictionaries } from './dto/paginated-dictionaries';
import { UpdateDictionaryInput } from './dto/update-dictionary.input';

@Resolver()
export class DictionaryResolver {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Mutation(() => Dictionary, { description: '创建字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Create,
  })
  createDictionary(
    @Args('createDictionaryInput') dictionary: CreateDictionaryInput,
  ) {
    return this.dictionaryService.create(dictionary);
  }

  @Query(() => PaginatedDictionaries, {
    name: 'dictionaries',
    description: '查询多个字典',
  })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaries(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.dictionaryService.getDictionaries({
      paginateInput,
    });
  }

  @Query(() => Dictionary, { name: 'dictionary', description: '查询单个字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionay(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.getDictionay(id);
  }

  @Mutation(() => Boolean, { description: '更新字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Update,
  })
  updateDictionary(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDictionaryInput') updateDictionaryInput: UpdateDictionaryInput,
  ) {
    return this.dictionaryService.update(id, updateDictionaryInput);
  }

  @Mutation(() => Boolean, { description: '删除字典' })
  @Permission({
    resource: AuthorizationResourceCode.Dictionary,
    action: AuthorizationActionCode.Delete,
  })
  removeDictionary(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryService.remove(id);
  }
}
