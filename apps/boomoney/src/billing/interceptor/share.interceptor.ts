import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BillingLoader } from '../billing.loader';

@Injectable()
export class ShareInterceptor implements NestInterceptor {
  constructor(private readonly billingLoader: BillingLoader) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 设置targetType
    this.billingLoader.setTargetType(TargetType.Billing);
    return next.handle();
  }
}
