import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';
import { BillingLoader } from './billing.loader';

@Module({
  providers: [BillingLoader, BillingResolver, BillingService],
})
export class BillingModule {}
