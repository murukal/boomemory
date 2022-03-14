import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from '@app/data-base/entities/boomart/tag.entity';

@Resolver()
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagInput: CreateTagInput) {
    return this.tagService.create(createTagInput);
  }

  @Query(() => [Tag], { name: 'tags' })
  getTags() {
    return this.tagService.getTags();
  }

  @Query(() => Tag, { name: 'tag' })
  getTag(@Args('id', { type: () => Int }) id: number) {
    return this.tagService.getTag(id);
  }

  @Mutation(() => Boolean)
  updateTag(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTagInput') tag: UpdateTagInput,
  ) {
    return this.tagService.update(id, tag);
  }

  @Mutation(() => Boolean)
  removeTag(@Args('id', { type: () => Int }) id: number) {
    return this.tagService.remove(id);
  }
}
