import { Injectable } from '@nestjs/common';
import { ConfigService as NativeConfigService } from '@nestjs/config';
import { AppID } from 'utils/app/assets';

@Injectable()
export class ConfigService {
  constructor(private readonly nativeConfigService: NativeConfigService) {}

  /**
   * 获取rsa公钥
   */
  getRsaPublicKey() {
    return this.nativeConfigService.get<string>('rsa.publicKey');
  }

  /**
   * 获取rsa私钥
   */
  getRsaPrivateKey() {
    return this.nativeConfigService.get<string>('rsa.privateKey');
  }

  /**
   * 获取jwt秘钥
   */
  getJwtSecret() {
    return this.nativeConfigService.get<string>('jwt.secret');
  }

  /**
   * 获取端口
   */
  getPort(appId: AppID) {
    return this.nativeConfigService.get<string | number>(`port.${appId}`);
  }

  /**
   * 获取cos桶
   */
  getCosBucket() {
    return this.nativeConfigService.get<string>('cos.bucket');
  }

  /**
   * 获取cos源
   */
  getCosRegion() {
    return this.nativeConfigService.get<string>('cos.region');
  }

  /**
   * 获取cos秘钥id
   */
  getCosSecretId() {
    return this.nativeConfigService.get<string>('cos.secretId');
  }

  /**
   * 获取cos秘钥key
   */
  getCosSecretKey() {
    return this.nativeConfigService.get<string>('cos.secretKey');
  }
}
