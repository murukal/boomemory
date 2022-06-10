import { User } from '@app/data-base/entities/boomemory';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MoneyProfile } from '@app/user/dto/money-profile';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { PaginatedUsers } from '@app/user/dto/paginated-users';
import { PaginateInput } from 'utils/dto';
import { FilterUserInput } from './dto/filter-user.input';
import { UserService } from './user.service';
import { UserLoader } from './user.loader';
import { MartProfile } from './dto/mart-profile';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userLoader: UserLoader,
  ) {}

  @Query(() => PaginatedUsers, {
    description: '分页查询用户',
    name: 'users',
  })
  getUsers(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterUserInput,
  ) {
    return this.userService.getUsers({
      paginateInput,
      filterInput,
    });
  }

  @ResolveField('isSelf', () => Boolean, {
    description: '是否为当前人',
  })
  getIsSelf(@Parent() user: User, @CurrentUser() current: User) {
    return !!current?.id && current?.id === user?.id;
  }

  @ResolveField('martProfile', () => MartProfile, {
    description: 'mart模块用户信息',
  })
  getMartProfile(@Parent() user: User) {
    return this.userLoader.getMartProfileById.load(user.id);
  }

  @ResolveField('moneyProfile', () => MoneyProfile, {
    description: 'money模块用户信息',
    nullable: true,
  })
  getMoneyProfile(@Parent() user: User) {
    return this.userLoader.getMoneyProfileById.load(user.id);
  }
}
