import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String, { name: 'rsaPublicKey' })
  getRsaPublicKey() {
    return this.appService.getRsaPublicKey();
  }

  @Query(() => String, { name: 'jwtSecret' })
  getJwtSecret() {
    return this.appService.getJwtSecret();
  }
}
