import { forwardRef, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [forwardRef(() => TenantModule)],
  providers: [MenuResolver, MenuService],
  exports: [MenuService],
})
export class MenuModule {}
