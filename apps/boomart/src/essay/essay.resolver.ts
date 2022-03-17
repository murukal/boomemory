import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EssayService } from './essay.service';
import { Essay } from '../../../../libs/data-base/src/entities/boomart/essay.entity';
import { CreateEssayInput } from './dto/create-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';
import { EssayPaginateOutput } from './dto/essay-paginate.output';
import { PaginateInput } from 'utils/dto';

@Resolver()
export class EssayResolver {
  constructor(private readonly essayService: EssayService) {}

  @Mutation(() => Essay, {
    description: '创建文章',
  })
  createEssay(@Args('createEssayInput') essay: CreateEssayInput) {
    return this.essayService.create(essay);
  }

  @Query(() => EssayPaginateOutput, {
    name: 'essays',
    description: '查询多个文章',
  })
  getEssays(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.essayService.getEssays({
      paginateInput,
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
}
