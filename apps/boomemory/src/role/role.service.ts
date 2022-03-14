import { CONNECTION_BOOMEMORY, Role } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role, CONNECTION_BOOMEMORY)
    private readonly roleRepository: Repository<Role>,
  ) {}

  create(role: CreateRoleInput) {
    return this.roleRepository.save(this.roleRepository.create(role));
  }

  getRoles() {
    return this.roleRepository.find();
  }

  getRole(id: number) {
    return this.roleRepository.findOne(id);
  }

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
