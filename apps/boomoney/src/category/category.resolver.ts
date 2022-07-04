import { Category } from '@app/data-base/entities/boomoney';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Float,
} from '@nestjs/graphql';
import { PaginateInput } from 'utils/dto';
import { TimeRangeInput } from 'utils/dto/time-range.input';
import { CategoryLoader } from './category.loader';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { FilterCategoryInput } from './dto/filter-category.input';
import { PaginatedCategories } from './dto/paginated-categories';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryLoader: CategoryLoader,
  ) {}

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
    @Args('filterInput', { nullable: true }) filterInput: FilterCategoryInput,
  ) {
    return this.categoryService.getCategories({
      paginateInput,
      filterInput,
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

  @ResolveField('totalExpense', () => Float, {
    description: '支出合计',
  })
  getTotalExpense(
    @Parent() category: Category,
    @Args('timeRangeInput') timeRangeInput: TimeRangeInput,
  ) {
    return this.categoryLoader.getTotalExpense.load({
      id: category.id,
      ...timeRangeInput,
    });
  }
}
