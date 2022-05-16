import { Category } from '@app/data-base/entities/boomoney';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category, {
    description: '创建分类',
  })
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories', description: '查询多个分类' })
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Query(() => Category, { name: 'category', description: '查询单个分类' })
  getCategory(
    @Args('id', { type: () => Int, description: '分类ID' }) id: number,
  ) {
    return this.categoryService.getCategory(id);
  }

  @Mutation(() => Category, {
    description: '更新分类',
  })
  updateCategory(
    @Args('id', {
      type: () => Int,
      description: '分类ID',
    })
    id: number,
    @Args('updateCategoryInput', {
      description: '分类',
    })
    updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => Category, {
    description: '删除分类',
  })
  removeCategory(
    @Args('id', { type: () => Int, description: '分类ID' }) id: number,
  ) {
    return this.categoryService.remove(id);
  }
}
