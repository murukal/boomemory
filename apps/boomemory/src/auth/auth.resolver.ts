import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

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
}
