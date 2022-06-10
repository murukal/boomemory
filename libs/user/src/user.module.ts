import { Global, Module } from '@nestjs/common';
import { UserLoader } from './user.loader';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
@Module({
  providers: [UserService, UserLoader, UserResolver],
  exports: [UserService],
})
export class UserModule {}
