import { Global, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';

@Global()
@Module({
  providers: [TenantResolver, TenantService],
  exports: [TenantService],
})
export class TenantModule {}
