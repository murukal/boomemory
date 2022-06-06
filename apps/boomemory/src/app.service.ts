import { ConfigService } from '@app/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getRsaPublicKey() {
    return this.configService.getRsaPublicKey();
  }

  getJwtSecret() {
    return this.configService.getJwtSecret();
  }
}
