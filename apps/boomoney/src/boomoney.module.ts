import { Module } from '@nestjs/common';
import { BillingModule } from './billing/billing.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { ShareModule } from './share/share.module';
import { initializeCommonModules } from 'utils/app/handlers';

@Module({
  imports: [
    // 公用服务模块
    ...initializeCommonModules(),

    // 项目服务模块
    BillingModule,
    CategoryModule,
    TransactionModule,
    ShareModule,
  ],
})
export class BoomoneyModule {}
