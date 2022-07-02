import { User } from '@app/data-base/entities/boomemory';
import { Category } from '@app/data-base/entities/boomoney';
import { UserService } from '@app/user';
import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');
import { CategoryService } from '../category/category.service';

@Injectable()
export class TransactionLoader {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  /**
   * 根据分类id获取分类信息
   */
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

  /**
   * 根据用户id获取用户信息
   */
  readonly getUserById = new DataLoader<number, User>(async (ids: number[]) => {
    const users = (
      await this.userService.getUsers({
        filterInput: {
          ids,
        },
      })
    ).items;

    return ids.map((id) => users.find((user) => user.id === id));
  });
}
