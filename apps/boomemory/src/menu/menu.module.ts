import { Global, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';
import { MenuLoader } from './menu.loader';

@Global()
@Module({
  providers: [MenuResolver, MenuService, MenuLoader],
  exports: [MenuService],
})
export class MenuModule {}
