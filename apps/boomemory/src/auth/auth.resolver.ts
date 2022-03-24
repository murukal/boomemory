import { User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { PaginateInput } from 'utils/dto/paginate.input';
import { AuthService } from './auth.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations';
import { AuthorizationNode } from './dto/authorization-node';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { PaginatedUsers } from './dto/paginated-users';
import { JwtAuthGuard } from './guard';
import { FilterUserInput } from './dto/filter-user.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { description: '登录' })
  login(@Args('loginInput') login: LoginInput): Promise<string> {
    return this.authService.login(login);
  }

  @Mutation(() => String, { description: '注册' })
  register(@Args('registerInput') register: RegisterInput): Promise<string> {
    return this.authService.register(register);
  }

  @Query(() => PaginatedUsers, {
    description: '查询多个用户',
    name: 'users',
  })
  getUsers(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
    @Args('filterInput', { nullable: true }) filterInput: FilterUserInput,
  ) {
    return this.authService.getUsers({
      paginateInput,
      filterInput,
    });
  }

  @Query(() => User, { description: '用户认证' })
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => PaginatedAuthorizations, {
    description: '查询多个权限',
    name: 'authorizations',
  })
  getAuthorizations() {
    return this.authService.getAuthorizations();
  }

  @Query(() => [AuthorizationNode], {
    description: '查询权限树',
    name: 'authorizationTree',
  })
  getAuthorizationTree() {
    return this.authService.getAuthorizationTree();
  }

  @ResolveField('creationCount', () => Int, {
    description: '作品个数',
  })
  getCreationCount(@Parent() user: User) {
    return this.authService.getCreationCount(user.id);
  }
}
