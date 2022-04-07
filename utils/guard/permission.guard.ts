import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleService } from 'apps/boomemory/src/role/role.service';
import { Option, PERMISSION_KEY } from 'utils/decorator/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const option = this.reflector.getAllAndOverride<Option>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //  无需鉴权
    if (!option) return true;

    // 获取用户信息
    const { user } = GqlExecutionContext.create(context).getContext().req;

    // 用户信息为空 = 无权
    if (!user) return false;

    return this.roleService.isPermitted(user.id, option);
  }
}
