import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { EssayService } from './essay.service';
import { Essay } from '../../../../libs/data-base/src/entities/boomart/essay.entity';
import { CreateEssayInput } from './dto/create-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';
import { PaginatedEssays } from './dto/paginated-essays';
import { PaginateInput } from 'utils/dto';
import { Tag, User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { FilterEssayInput } from './dto/filter-essay.input';

@Resolver(() => Essay)
export class EssayResolver {
  constructor(private readonly essayService: EssayService) {}

  @Mutation(() => Essay, {
    description: '创建文章',
  })
  @UseGuards(JwtAuthGuard)
  createEssay(
    @Args('createEssayInput') essay: CreateEssayInput,
    @CurrentUser() user: User,
  ) {
    return this.essayService.create(essay, user.id);
  }

  @Query(() => PaginatedEssays, {
    name: 'essays',
    description: '查询多个文章',
  })
  getEssays(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterEssayInput,
  ) {
    return this.essayService.getEssays({
      paginateInput,
      filterInput,
    });
  }

  @Query(() => Essay, { name: 'essay', description: '查询单个文章' })
  getEssay(@Args('id', { type: () => Int }) id: number) {
    return this.essayService.getEssay(id);
  }

  @Mutation(() => Boolean, {
    description: '更新文章',
  })
  updateEssay(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateEssayInput') essay: UpdateEssayInput,
  ) {
    return this.essayService.update(id, essay);
  }

  @Mutation(() => Boolean, {
    description: '删除文章',
  })
  removeEssay(@Args('id', { type: () => Int }) id: number) {
    return this.essayService.remove(id);
  }

  @ResolveField(() => [Tag], {
    name: 'tags',
    description: '文章对应的tag',
  })
  getTags(@Parent() essay: Essay) {
    return this.essayService.getTags(essay.id);
  }

  @ResolveField(() => [Int], {
    name: 'tagIds',
    description: '文章对应的tagIds',
  })
  getTagIds(@Parent() essay: Essay) {
    return this.essayService.getTagIds(essay.id);
  }

  @ResolveField(() => User, {
    name: 'createdBy',
    description: '创作者',
  })
  getCreatedBy(@Parent() essay: Essay) {
    return this.essayService.getCreatedBy(essay.id);
  }
}
