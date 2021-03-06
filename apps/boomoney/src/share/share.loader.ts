import { User } from '@app/data-base/entities/boomemory';
import { UserService } from '@app/user';
import { Injectable } from '@nestjs/common';
import DataLoader = require('dataloader');

@Injectable()
export class ShareLoader {
  constructor(private readonly userService: UserService) {}

  /**
   * 根据用户id获取用户信息
   */
  public readonly getUserById = new DataLoader<number, User>(
    async (userIds: number[]) => {
      return await this.userService.getUsers4UserIds(userIds);
    },
  );
}
