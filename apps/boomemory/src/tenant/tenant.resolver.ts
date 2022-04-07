import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TenantService } from './tenant.service';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';
import { Menu, Tenant } from '@app/data-base/entities';
import { PaginateInput } from 'utils/dto';
import { PaginatedTenants } from './dto/paginated-tenants';
import { Permission } from 'utils/decorator/permission.decorator';
import {
  Action,
  Resource,
} from '@app/data-base/entities/boomemory/authorization.entity';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Mutation(() => Tenant, { description: '创建租户' })
  @Permission({
    resource: Resource.Tenant,
    action: Action.Create,
  })
  createTenant(
    @Args('createTenantInput') createTenantInput: CreateTenantInput,
  ) {
    return this.tenantService.create(createTenantInput);
  }

  @Query(() => PaginatedTenants, {
    name: 'tenants',
    description: '查询多个租户',
  })
  @Permission({
    resource: Resource.Tenant,
    action: Action.Retrieve,
  })
  getTenants(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.tenantService.getTenants({ paginateInput });
  }

  @Query(() => Tenant, {
    name: 'tenant',
    description: '查询单个租户',
    nullable: true,
  })
  @Permission({
    resource: Resource.Tenant,
    action: Action.Retrieve,
  })
  getTenant(
    @Args('code', {
      type: () => String,
    })
    code: string,
  ) {
    return this.tenantService.getTenant(code);
  }

  @Mutation(() => Boolean, { description: '更新租户' })
  @Permission({
    resource: Resource.Tenant,
    action: Action.Update,
  })
  updateTenant(
    @Args('code', { type: () => String }) code: string,
    @Args('updateTenantInput') updateTenantInput: UpdateTenantInput,
  ) {
    return this.tenantService.update(code, updateTenantInput);
  }

  @Mutation(() => Boolean, { description: '删除租户' })
  @Permission({
    resource: Resource.Tenant,
    action: Action.Delete,
  })
  removeTenant(@Args('code', { type: () => String }) code: string) {
    return this.tenantService.remove(code);
  }

  @ResolveField(() => [Menu], {
    name: 'menus',
    description: '租户对应的菜单',
  })
  getMenus(@Parent() tenant: Tenant) {
    return this.tenantService.getTenantMenus(tenant.code);
  }
}
