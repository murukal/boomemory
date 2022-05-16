import { CONNECTION_BOOMEMORY } from '@app/data-base/entities';
import { User } from '@app/data-base/entities/boomemory';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DataLoader = require('dataloader');
import { Repository } from 'typeorm';

@Injectable()
export class ShareLoader {
  constructor(
    @InjectRepository(User, CONNECTION_BOOMEMORY)
    private readonly userRepository: Repository<User>,
  ) {}

  public readonly getUserBySharedById = new DataLoader<number, User>(
    async (sharedByIds) => {
      console.log('runtime============');

      const users = await this.userRepository
        .createQueryBuilder()
        .whereInIds(sharedByIds)
        .getMany();

      return sharedByIds.map((userId) =>
        users.find((user) => user.id === userId),
      );
    },
  );
}
