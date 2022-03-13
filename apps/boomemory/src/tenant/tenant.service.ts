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

  create(createTenantInput: CreateTenantInput) {
    return this.tenantRepository.save(
      this.tenantRepository.create(createTenantInput),
    );
  }

  getTenants() {
    return this.tenantRepository.find();
  }

  getTenant(id: number) {
    return this.tenantRepository.findOne(id);
  }

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

  async remove(id: number) {
    return !!(
      await this.tenantRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute()
    ).affected;
  }
}
