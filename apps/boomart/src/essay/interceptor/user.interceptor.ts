import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { EssayLoader } from '../essay.loader';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly essayLoader: EssayLoader) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 设置用户id
    this.essayLoader.setUserId(
      GqlExecutionContext.create(context).getContext().req?.user?.id,
    );

    return next.handle();
  }
}
