import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';

@Global()
@Module({
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
