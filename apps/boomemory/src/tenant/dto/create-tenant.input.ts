import { Tenant } from '@app/data-base/entities/boomemory';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateTenantInput extends PickType(
  Tenant,
  ['code', 'name'],
  InputType,
) {}
