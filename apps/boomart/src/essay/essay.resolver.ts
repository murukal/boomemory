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
import { CreateEssayInput } from './dto/create-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';
import { PaginatedEssays } from './dto/paginated-essays';
import { PaginateInput } from 'utils/dto';
import { Tag, User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { FilterEssayInput } from './dto/filter-essay.input';
import { ToggleService } from '../toggle/toggle.service';
import { TargetType, Type } from 'utils/dto/toggle-enum';
import { Essay } from '@app/data-base/entities';

@Resolver(() => Essay)
export class EssayResolver {
  constructor(
    private readonly essayService: EssayService,
    private readonly toggleService: ToggleService,
  ) {}

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
  @UseGuards(new JwtAuthGuard(false))
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

  @ResolveField('createdBy', () => User, {
    description: '创作者',
  })
  getCreatedBy(@Parent() essay: Essay) {
    return this.essayService.getCreatedBy(essay.id);
  }

  @ResolveField(() => Int, {
    name: `${Type.browse}Clout`,
    description: '浏览量',
  })
  getBrowseClout(@Parent() essay: Essay) {
    return this.toggleService.getClout(Type.browse, TargetType.essay, essay.id);
  }

  @ResolveField(() => Int, {
    name: `${Type.like}Clout`,
    description: '点赞量',
  })
  getLikeClout(@Parent() essay: Essay) {
    return this.toggleService.getClout(Type.like, TargetType.essay, essay.id);
  }

  @ResolveField(() => Int, {
    name: `${Type.collect}Clout`,
    description: '收藏量',
  })
  getCollectClout(@Parent() essay: Essay) {
    return this.toggleService.getClout(
      Type.collect,
      TargetType.essay,
      essay.id,
    );
  }

  @ResolveField(() => Boolean, {
    name: 'isLiked',
    description: '是否被当前用户点赞',
  })
  getIsLiked(@CurrentUser() user: User) {
    return this.essayService.getIsToggled(user, Type.like);
  }

  @ResolveField(() => Boolean, {
    name: 'isCollected',
    description: '是否被当前用户收藏',
  })
  getIsCollected(@CurrentUser() user: User) {
    return this.essayService.getIsToggled(user, Type.collect);
  }
}
