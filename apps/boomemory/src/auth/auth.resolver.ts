import { User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { JwtAuthGuard } from './guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  login(@Args('loginInput') login: LoginInput): Promise<string> {
    return this.authService.login(login);
  }

  @Mutation(() => String)
  register(@Args('registerInput') register: RegisterInput): Promise<string> {
    return this.authService.register(register);
  }

  @Query(() => [User])
  getUsers() {
    return this.authService.getUsers();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}
