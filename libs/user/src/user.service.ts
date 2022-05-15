import { CONNECTION_BOOMEMORY } from '@app/data-base/entities';
import { User } from '@app/data-base/entities/boomemory';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterUserInput } from 'apps/boomemory/src/auth/dto/filter-user.input';
import { RegisterInput } from 'apps/boomemory/src/auth/dto/register.input';
import { FindOptionsSelect, In, Not, Repository } from 'typeorm';
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
  async getUser(keyword: number | string, select?: FindOptionsSelect<User>) {
    // keyword 为空：抛出异常
    if (!keyword) {
      throw new Error('用户关键字不能为初始值！');
    }

    // 查询指定用户
    const user = await this.userRepository.findOne({
      select: select,
      where: [
        {
          id: keyword as number,
        },
        {
          username: keyword as string,
        },
        {
          email: keyword as string,
        },
      ],
    });

    return user;
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
  getUsers(query?: QueryParams<FilterUserInput>) {
    return paginateQuery(this.userRepository, {
      paginateInput: query?.paginateInput,
      filterInput: {
        ...(query?.filterInput?.ids && {
          id: In(query?.filterInput?.ids),
        }),

        ...(query?.filterInput?.excludeIds && {
          id: Not(In(query?.filterInput?.excludeIds)),
        }),
      },
    });
  }
}
