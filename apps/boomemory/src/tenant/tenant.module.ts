import { Global, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';
import { MenuModule } from '../menu/menu.module';

@Global()
@Module({
  imports: [MenuModule],
  providers: [TenantResolver, TenantService],
  exports: [TenantService],
})
export class TenantModule {}
