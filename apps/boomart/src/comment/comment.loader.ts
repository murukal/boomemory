import { User } from '@app/data-base/entities/boomemory';
import { UserService } from '@app/user';
import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');

@Injectable()
export class CommentLoader {
  constructor(private readonly userService: UserService) {}

  /**
   * 根据用户id返回用户信息
   */
  public getUserById = new DataLoader<number, User>(
    async (userIds: number[]) => {
      return await this.userService.getUsers4UserIds(userIds);
    },
  );
}
