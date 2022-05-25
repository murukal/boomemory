import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TransactionLoader } from './transaction.loader';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  providers: [TransactionResolver, TransactionService, TransactionLoader],
})
export class TransactionModule {}
