import { applyDecorators, UseGuards } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '@app/passport/guard';
import { PermissionGuard } from 'utils/guard';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { AuthorizationActionCode } from '@app/data-base/entities/boomemory/authorization-action.entity';

export interface Option {
  resource: AuthorizationResourceCode;
  action: AuthorizationActionCode;
}

export const PERMISSION_KEY = 'permission';

export const Permission = (option: Option) => {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, option),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
