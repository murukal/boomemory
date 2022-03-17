import { CONNECTION_BOOMEMORY, Role } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role, CONNECTION_BOOMEMORY)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 创建角色
   */
  create(role: CreateRoleInput) {
    return this.roleRepository.save(this.roleRepository.create(role));
  }

  /**
   * 查询多个角色
   */
  getRoles(query?: QueryParams) {
    return paginateQuery(this.roleRepository, query);
  }

  /**
   * 查询单个角色
   */
  getRole(id: number) {
    return this.roleRepository.findOne(id);
  }

  /**
   * 更新角色
   */
  async update(id: number, role: UpdateRoleInput) {
    return !!(
      await this.roleRepository
        .createQueryBuilder()
        .update()
        .set({
          ...role,
        })
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 删除角色
   */
  async remove(id: number) {
    return !!(
      await this.roleRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
