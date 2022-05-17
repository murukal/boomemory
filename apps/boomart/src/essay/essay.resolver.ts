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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { FilterEssayInput } from './dto/filter-essay.input';
import { ToggleService } from '../toggle/toggle.service';
import {
  TargetType,
  Type,
} from '@app/data-base/entities/boomart/toggle.entity';
import { EssayLoader } from './essay.loader';
import { Essay, Tag } from '@app/data-base/entities/boomart';
import { User } from '@app/data-base/entities/boomemory';

@Resolver(() => Essay)
export class EssayResolver {
  constructor(
    private readonly essayService: EssayService,
    private readonly toggleService: ToggleService,
    private readonly essayLoader: EssayLoader,
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
  @UseGuards(new JwtAuthGuard(true))
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
    return this.essayLoader.getTagsByEssayId.load(essay.id);
  }

  @ResolveField(() => [Int], {
    name: 'tagIds',
    description: '文章对应的tagIds',
  })
  async getTagIds(@Parent() essay: Essay) {
    return (await this.essayLoader.getTagsByEssayId.load(essay.id)).map(
      (tag) => tag.id,
    );
  }

  @ResolveField('createdBy', () => User, {
    description: '创作者',
    nullable: true,
  })
  getCreatedBy(@Parent() essay: Essay) {
    return this.essayLoader.getUserById.load(essay.createdById);
  }

  @ResolveField(() => Int, {
    name: `${Type.Browse}Clout`,
    description: '浏览量',
  })
  getBrowseClout(@Parent() essay: Essay) {
    return this.essayLoader.getBrowseCloutById.load(essay.id);
  }

  @ResolveField(() => Int, {
    name: `${Type.Like}Clout`,
    description: '点赞量',
  })
  getLikeClout(@Parent() essay: Essay) {
    return this.essayLoader.getLikeCloutById.load(essay.id);
  }

  @ResolveField(() => Int, {
    name: `${Type.Collect}Clout`,
    description: '收藏量',
  })
  getCollectClout(@Parent() essay: Essay) {
    return this.essayLoader.getCollectCloutById.load(essay.id);
  }

  @ResolveField(() => Boolean, {
    name: 'isLiked',
    description: '是否被当前用户点赞',
  })
  getIsLiked(@CurrentUser() user: User, @Parent() essay: Essay) {
    return this.essayService.getIsToggled(user.id, {
      type: Type.Like,
      targetType: TargetType.Essay,
      targetId: essay.id,
    });
  }

  @ResolveField(() => Boolean, {
    name: 'isCollected',
    description: '是否被当前用户收藏',
  })
  getIsCollected(@CurrentUser() user: User, @Parent() essay: Essay) {
    return this.essayService.getIsToggled(user.id, {
      type: Type.Collect,
      targetType: TargetType.Essay,
      targetId: essay.id,
    });
  }
}
