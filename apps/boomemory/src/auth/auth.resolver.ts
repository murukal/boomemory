import { Authorization, User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { PaginateInput } from 'utils/dto/paginate.input';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { JwtAuthGuard } from './guard';

@Resolver()
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

  @Query(() => [User], { description: '查询多个用户', name: 'users' })
  getUsers(@Args('paginateInput') paginateInput: PaginateInput) {
    return this.authService.getUsers({
      paginateInput,
    });
  }

  @Query(() => User, { description: '用户认证' })
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => [Authorization], {
    description: '查询多个权限',
    name: 'authorizations',
  })
  getAuthorizations() {
    return this.authService.getAuthorizations();
  }
}
