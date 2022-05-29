import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';
import { BillingLoader } from './billing.loader';
import { ShareModule } from '../share/share.module';

@Module({
  imports: [ShareModule],
  providers: [BillingLoader, BillingResolver, BillingService],
})
export class BillingModule {}
