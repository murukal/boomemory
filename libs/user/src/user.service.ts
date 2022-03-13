import { CONNECTION_BOOMEMORY, User } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterArgs } from 'apps/boomemory/src/auth/dto/register.args';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, CONNECTION_BOOMEMORY)
    private readonly userRepository: Repository<User>,
  ) {}

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

  create(register: RegisterArgs) {
    return this.userRepository.save(this.userRepository.create(register));
  }
}
