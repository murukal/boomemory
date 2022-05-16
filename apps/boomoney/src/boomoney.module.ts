import { Module } from '@nestjs/common';
import { BoomoneyController } from './boomoney.controller';
import { BoomoneyService } from './boomoney.service';
import { BillingModule } from './billing/billing.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [BillingModule, CategoryModule, TransactionModule, ShareModule],
  controllers: [BoomoneyController],
  providers: [BoomoneyService],
})
export class BoomoneyModule {}
