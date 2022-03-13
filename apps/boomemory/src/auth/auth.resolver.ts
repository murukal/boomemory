import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginArgs } from './dto/login.args';
import { RegisterArgs } from './dto/register.args';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  login(@Args() login: LoginArgs): Promise<string> {
    return this.authService.login(login);
  }

  @Mutation(() => String)
  register(@Args() register: RegisterArgs): Promise<string> {
    return this.authService.register(register);
  }
}
