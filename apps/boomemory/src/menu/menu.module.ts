import { Global, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';

@Global()
@Module({
  providers: [MenuResolver, MenuService],
  exports: [MenuService],
})
export class MenuModule {}
