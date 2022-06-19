import {
  AuthorizationAction,
  AuthorizationResource,
  User,
} from '@app/data-base/entities/boomemory';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { PaginatedAuthorizations } from './dto/paginated-authorizations';
import { AuthorizationNode } from './dto/authorization-node';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthorizationsArgs } from './dto/authorizations.args';
import { VerifyInput } from './dto/verify.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { SendCaptchaArgs } from './dto/send-captcha.args';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String, { description: '登录' })
  login(@Args('loginInput') login: LoginInput) {
    return this.authService.login(login);
  }

  @Mutation(() => String, { description: '注册' })
  register(@Args('registerInput') register: RegisterInput) {
    return this.authService.register(register);
  }

  @Query(() => PaginatedAuthorizations, {
    description: '分页查询权限',
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

  @Query(() => [AuthorizationResource], {
    name: 'authorizationResources',
    description: '权限资源',
  })
  getAuthorizationResources() {
    return this.authService.getAuthorizationResources();
  }

  @Query(() => [AuthorizationAction], {
    name: 'authorizationActions',
    description: '权限操作',
  })
  getAuthorizationActions() {
    return this.authService.getAuthorizationActions();
  }

  @Mutation(() => Boolean, {
    description: '分配权限',
  })
  setAuthorizations(@Args() args: AuthorizationsArgs) {
    return this.authService.setAuthorizations(args);
  }

  @Mutation(() => Date, {
    description: '发送验证码',
    nullable: true,
  })
  sendCaptcha(@Args() sendCaptchaArgs: SendCaptchaArgs) {
    return this.authService.sendCaptcha(sendCaptchaArgs);
  }

  @Mutation(() => Boolean, {
    description: '验证用户',
  })
  @UseGuards(JwtAuthGuard)
  verify(
    @Args('verifyInput', {
      description: '验证信息',
    })
    verifyInput: VerifyInput,
    @CurrentUser() user: User,
  ) {
    return this.authService.verify(verifyInput, user.emailAddress);
  }
}
