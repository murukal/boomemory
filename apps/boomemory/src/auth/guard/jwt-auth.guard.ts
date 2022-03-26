import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  isStrict = false;

  constructor(isStrict?: boolean) {
    super();
    this.isStrict = !!isStrict;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (this.isStrict && (err || !user)) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
