import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthLoader } from './auth.loader';

@Module({
  providers: [AuthResolver, AuthService, AuthLoader],
  exports: [AuthService],
})
export class AuthModule {}
