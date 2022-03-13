import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TenantService } from './tenant.service';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';
import { Tenant } from '@app/data-base/entities';

@Resolver()
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Mutation(() => Tenant)
  createTenant(
    @Args('createTenantInput') createTenantInput: CreateTenantInput,
  ) {
    return this.tenantService.create(createTenantInput);
  }

  @Query(() => [Tenant], { name: 'tenants' })
  getTenants() {
    return this.tenantService.getTenants();
  }

  @Query(() => Tenant, { name: 'tenant' })
  getTenant(@Args('id', { type: () => Int }) id: number) {
    return this.tenantService.getTenant(id);
  }

  @Mutation(() => Boolean)
  updateTenant(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTenantInput') updateTenantInput: UpdateTenantInput,
  ) {
    return this.tenantService.update(id, updateTenantInput);
  }

  @Mutation(() => Boolean)
  removeTenant(@Args('id', { type: () => Int }) id: number) {
    return this.tenantService.remove(id);
  }
}
