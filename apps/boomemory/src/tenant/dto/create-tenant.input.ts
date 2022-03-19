import { Tenant } from '@app/data-base/entities';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateTenantInput extends PickType(
  Tenant,
  ['code', 'name', 'isAuthorizate'],
  InputType,
) {}
