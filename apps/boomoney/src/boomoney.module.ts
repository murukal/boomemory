import { Module } from '@nestjs/common';
import { BoomoneyController } from './boomoney.controller';
import { BoomoneyService } from './boomoney.service';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [BillingModule],
  controllers: [BoomoneyController],
  providers: [BoomoneyService],
})
export class BoomoneyModule {}
