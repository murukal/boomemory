import { Category } from '@app/data-base/entities/boomoney';
import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { CategoryService } from '../category/category.service';

@Injectable()
export class TransactionLoader {
  constructor(private readonly categoryService: CategoryService) {}

  readonly getCategoryById = new DataLoader<number, Category>(
    async (ids: number[]) => {
      const categories = (
        await this.categoryService.getCategories({
          filterInput: {
            ids,
          },
        })
      ).items;

      return ids.map((id) => categories.find((category) => category.id === id));
    },
  );
}
