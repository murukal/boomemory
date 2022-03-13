import { CreateTenantInput } from './create-tenant.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTenantInput extends PartialType(CreateTenantInput) {}
