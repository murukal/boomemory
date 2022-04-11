import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from '@app/data-base/entities';
import { PaginateInput } from 'utils/dto';
import { PaginatedRole } from './dto/paginated-roles';
import { Permission } from 'utils/decorator/permission.decorator';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { AuthorizationActionCode } from '@app/data-base/entities/boomemory/authorization-action.entity';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, {
    description: '创建角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Create,
  })
  createRole(@Args('createRoleInput') role: CreateRoleInput) {
    return this.roleService.create(role);
  }

  @Query(() => PaginatedRole, {
    name: 'roles',
    description: '查询多个角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Retrieve,
  })
  getRoles(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.roleService.getRoles({
      paginateInput,
    });
  }

  @Query(() => Role, { name: 'role', description: '查询单个角色' })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Retrieve,
  })
  getRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.getRole(id);
  }

  @Mutation(() => Boolean, {
    description: '更新角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Update,
  })
  updateRole(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateRoleInput') role: UpdateRoleInput,
  ) {
    return this.roleService.update(id, role);
  }

  @Mutation(() => Boolean, {
    description: '删除角色',
  })
  @Permission({
    resource: AuthorizationResourceCode.Role,
    action: AuthorizationActionCode.Delete,
  })
  removeRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.remove(id);
  }

  @ResolveField(() => [Int], {
    name: 'userIds',
    description: '关联的用户ids',
  })
  getUserIds(@Parent() role: Role) {
    return this.roleService.getUserIds(role.id);
  }

  @ResolveField(() => [Int], {
    name: 'authorizationIds',
    description: '关联的权限ids',
  })
  getAuthorizationIds(@Parent() role: Role) {
    return this.roleService.getAuthorizationIds(role.id);
  }
}
