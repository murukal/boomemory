import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { TenantService } from './tenant.service';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';
import { Tenant } from '@app/data-base/entities';

@Resolver()
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Mutation(() => Tenant, { description: '创建租户' })
  createTenant(
    @Args('createTenantInput') createTenantInput: CreateTenantInput,
  ) {
    return this.tenantService.create(createTenantInput);
  }

  @Query(() => [Tenant], { name: 'tenants', description: '查询多个租户' })
  getTenants() {
    return this.tenantService.getTenants();
  }

  @Query(() => Tenant, {
    name: 'tenant',
    description: '查询单个租户',
    nullable: true,
  })
  getTenant(
    @Args('keyword', {
      type: () => ID,
    })
    keyword: number | string,
  ) {
    return this.tenantService.getTenant(keyword);
  }

  @Mutation(() => Boolean, { description: '更新租户' })
  updateTenant(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTenantInput') updateTenantInput: UpdateTenantInput,
  ) {
    return this.tenantService.update(id, updateTenantInput);
  }

  @Mutation(() => Boolean, { description: '删除租户' })
  removeTenant(@Args('id', { type: () => Int }) id: number) {
    return this.tenantService.remove(id);
  }
}
