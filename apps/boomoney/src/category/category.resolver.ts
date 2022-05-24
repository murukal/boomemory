import { Category } from '@app/data-base/entities/boomoney';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaginateInput } from 'utils/dto';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { PaginatedCategories } from './dto/paginated-categories';
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

  @Query(() => PaginatedCategories, {
    name: 'categories',
    description: '分页查询分类',
  })
  getCategories(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.categoryService.getCategories({
      paginateInput,
    });
  }

  @Query(() => Category, { name: 'category', description: '查询单个分类' })
  getCategory(
    @Args('id', { type: () => Int, description: '分类id' }) id: number,
  ) {
    return this.categoryService.getCategory(id);
  }

  @Mutation(() => Boolean, {
    description: '更新分类',
  })
  updateCategory(
    @Args('id', {
      type: () => Int,
      description: '分类id',
    })
    id: number,
    @Args('updateCategoryInput', {
      description: '分类',
    })
    updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => Boolean, {
    description: '删除分类',
  })
  removeCategory(
    @Args('id', { type: () => Int, description: '分类id' }) id: number,
  ) {
    return this.categoryService.remove(id);
  }
}
