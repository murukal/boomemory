import { CONNECTION_BOOMEMORY, Tenant } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant, CONNECTION_BOOMEMORY)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * 创建租户
   */
  create(createTenantInput: CreateTenantInput) {
    return this.tenantRepository.save(
      this.tenantRepository.create(createTenantInput),
    );
  }

  /**
   * 查询多个租户
   */
  getTenants() {
    return this.tenantRepository.find();
  }

  /**
   * 查询单个租户
   */
  getTenant(keyword: number | string) {
    return this.tenantRepository.findOne({
      where: [
        {
          id: keyword,
        },
        {
          code: keyword,
        },
      ],
    });
  }

  /**
   * 更新租户
   */
  async update(id: number, updateTenantInput: UpdateTenantInput) {
    return !!(
      await this.tenantRepository
        .createQueryBuilder()
        .update()
        .whereInIds(id)
        .set({
          ...updateTenantInput,
        })
        .execute()
    ).affected;
  }

  /**
   * 删除租户
   */
  async remove(id: number) {
    return !!(
      await this.tenantRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
