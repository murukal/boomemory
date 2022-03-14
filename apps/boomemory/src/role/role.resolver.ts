import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from '@app/data-base/entities';

@Resolver()
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role)
  createRole(@Args('createRoleInput') role: CreateRoleInput) {
    return this.roleService.create(role);
  }

  @Query(() => [Role], { name: 'roles' })
  getRoles() {
    return this.roleService.getRoles();
  }

  @Query(() => Role, { name: 'role' })
  getRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.getRole(id);
  }

  @Mutation(() => Boolean)
  updateRole(
    @Args('id', {
      type: () => Int,
    })
    id: number,
    @Args('updateRoleInput') role: UpdateRoleInput,
  ) {
    return this.roleService.update(id, role);
  }

  @Mutation(() => Boolean)
  removeRole(@Args('id', { type: () => Int }) id: number) {
    return this.roleService.remove(id);
  }
}
