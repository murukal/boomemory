import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { CategoryLoader } from './category.loader';

@Module({
  providers: [CategoryResolver, CategoryService, CategoryLoader],
  exports: [CategoryService],
})
export class CategoryModule {}
