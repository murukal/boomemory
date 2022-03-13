import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  go2Playground(res: Response) {
    return res.status(302).redirect('/graphql');
  }

  getRsaPublicKey() {
    return this.configService.get<string>('rsa.publicKey');
  }

  getJwtSecret() {
    return this.configService.get<string>('jwt.secret');
  }
}
