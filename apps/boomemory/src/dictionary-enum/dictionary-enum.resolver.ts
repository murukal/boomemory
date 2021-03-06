import { AuthorizationActionCode } from '@app/data-base/entities/boomemory/authorization-action.entity';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { DictionaryEnum } from '@app/data-base/entities/boomemory/dictionary-enum.entity';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Permission } from 'utils/decorator/permission.decorator';
import { PaginateInput } from 'utils/dto';
import { DictionaryEnumService } from './dictionary-enum.service';
import { CreateDictionaryEnumInput } from './dto/create-dictionary-enum.input';
import { PaginatedDictionaryEnum } from './dto/paginated-dictionary-enums';
import { UpdateDictionaryEnumInput } from './dto/update-dictionary-enum.input';

@Resolver()
export class DictionaryEnumResolver {
  constructor(private readonly dictionaryEnumService: DictionaryEnumService) {}

  @Mutation(() => DictionaryEnum, {
    description: '创建字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Create,
  })
  createDictionaryEnum(
    @Args('createDictionaryEnumInput')
    dictionaryEnum: CreateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.create(dictionaryEnum);
  }

  @Query(() => PaginatedDictionaryEnum, {
    name: 'dictionaryEnums',
    description: '分页查询字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaryEnums(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.dictionaryEnumService.getDictionaryEnums({
      paginateInput,
    });
  }

  @Query(() => DictionaryEnum, {
    name: 'dictionaryEnum',
    description: '查询单个字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Retrieve,
  })
  getDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.getDictionaryEnum(id);
  }

  @Mutation(() => Boolean, {
    description: '更新字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Update,
  })
  updateDictionaryEnum(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDictionaryEnumInput')
    updateDictionaryEnumInput: UpdateDictionaryEnumInput,
  ) {
    return this.dictionaryEnumService.update(id, updateDictionaryEnumInput);
  }

  @Mutation(() => Boolean, {
    description: '删除字典枚举',
  })
  @Permission({
    resource: AuthorizationResourceCode.DictionaryEnum,
    action: AuthorizationActionCode.Delete,
  })
  removeDictionaryEnum(@Args('id', { type: () => Int }) id: number) {
    return this.dictionaryEnumService.remove(id);
  }
}
