import { Module } from '@nestjs/common';
import { BoomoneyController } from './boomoney.controller';
import { BoomoneyService } from './boomoney.service';
import { BillingModule } from './billing/billing.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [BillingModule, UserProfileModule],
  controllers: [BoomoneyController],
  providers: [BoomoneyService],
})
export class BoomoneyModule {}
