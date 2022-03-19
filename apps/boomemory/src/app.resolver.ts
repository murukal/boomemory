import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String, { name: 'rsaPublicKey', description: 'RSA公钥' })
  getRsaPublicKey() {
    return this.appService.getRsaPublicKey();
  }

  @Query(() => String, { name: 'jwtSecret', description: 'JWT秘钥' })
  getJwtSecret() {
    return this.appService.getJwtSecret();
  }
}
