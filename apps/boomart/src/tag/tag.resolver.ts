import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from '@app/data-base/entities/boomart/tag.entity';
import { PaginateInput } from 'utils/dto';
import { PaginatedTags } from './dto/paginated-tags';
import { TopTag } from './dto/top-tag';

@Resolver()
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag, {
    description: '创建标签',
  })
  createTag(@Args('createTagInput') createTagInput: CreateTagInput) {
    return this.tagService.create(createTagInput);
  }

  @Query(() => PaginatedTags, { name: 'tags', description: '查询多个标签' })
  getTags(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.tagService.getTags({
      paginateInput,
    });
  }

  @Query(() => Tag, { name: 'tag', description: '查询单个标签' })
  getTag(@Args('id', { type: () => Int }) id: number) {
    return this.tagService.getTag(id);
  }

  @Mutation(() => Boolean, { description: '更新标签' })
  updateTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTagInput') tag: UpdateTagInput,
  ) {
    return this.tagService.update(id, tag);
  }

  @Mutation(() => Boolean, { description: '删除标签' })
  removeTag(@Args('id', { type: () => Int }) id: number) {
    return this.tagService.remove(id);
  }

  @Query(() => [TopTag], {
    name: 'topTags',
    description: '标签榜单',
  })
  getTopTags() {
    return this.tagService.getTopTags();
  }
}
