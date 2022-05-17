import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TopTagLoader } from '../top-tag.loader';

@Injectable()
export class TimeRangeInterceptor implements NestInterceptor {
  constructor(private readonly topTagLoader: TopTagLoader) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const args = GqlExecutionContext.create(context).getArgs();
    // 设置targetType
    this.topTagLoader.setTimeRange(args.from, args.to);
    return next.handle();
  }
}
