import { CONNECTION_BOOMEMORY, User } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterInput } from 'apps/boomemory/src/auth/dto/register.input';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, CONNECTION_BOOMEMORY)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 获取单个用户
   */
  getUser(keyword: number | string) {
    return this.userRepository.findOne({
      where: [
        {
          id: keyword,
        },
        {
          username: keyword,
        },
        {
          email: keyword,
        },
      ],
    });
  }

  /**
   * 创建用户
   */
  create(register: RegisterInput) {
    return this.userRepository.save(this.userRepository.create(register));
  }

  /**
   * 查询多个用户
   */
  getUsers(query?: QueryParams) {
    return paginateQuery(this.userRepository, query);
  }
}
