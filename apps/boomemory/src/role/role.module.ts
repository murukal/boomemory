import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
