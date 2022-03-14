import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EssayService } from './essay.service';
import { Essay } from '../../../../libs/data-base/src/entities/boomart/essay.entity';
import { CreateEssayInput } from './dto/create-essay.input';
import { UpdateEssayInput } from './dto/update-essay.input';

@Resolver(() => Essay)
export class EssayResolver {
  constructor(private readonly essayService: EssayService) {}

  @Mutation(() => Essay)
  createEssay(@Args('createEssayInput') essay: CreateEssayInput) {
    return this.essayService.create(essay);
  }

  @Query(() => [Essay], { name: 'essays' })
  getEssays() {
    return this.essayService.getEssays();
  }

  @Query(() => Essay, { name: 'essay' })
  getEssay(@Args('id', { type: () => Int }) id: number) {
    return this.essayService.getEssay(id);
  }

  @Mutation(() => Boolean)
  updateEssay(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateEssayInput') essay: UpdateEssayInput,
  ) {
    return this.essayService.update(id, essay);
  }

  @Mutation(() => Boolean)
  removeEssay(@Args('id', { type: () => Int }) id: number) {
    return this.essayService.remove(id);
  }
}
