import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from '@app/data-base/entities';
import { PaginateInput } from 'utils/dto';
import { PaginatedRole } from './dto/paginated-roles';

@Resolver()
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, {
    description: '创建角色',
  })
  createRole(@Args('createRoleInput') role: CreateRoleInput) {
    return this.roleService.create(role);
  }

  @Query(() => PaginatedRole, {
    name: 'roles',
    description: '查询多个角色',
  })
  getRoles(
    @Args('paginateInput', { nullable: true }) paginateInput: PaginateInput,
  ) {
    return this.roleService.getRoles({
      paginateInput,
    });
  }

  @Query(() => Role, { name: 'role', description: '查询单个角色' })
  getRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.getRole(id);
  }

  @Mutation(() => Boolean, {
    description: '更新角色',
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
  removeRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.remove(id);
  }
}
