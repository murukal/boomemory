import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';

@Module({
  providers: [BillingResolver, BillingService],
})
export class BillingModule {}
