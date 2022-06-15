import { Injectable } from '@nestjs/common';
import COS = require('cos-nodejs-sdk-v5');
import type { UploadBody } from 'cos-nodejs-sdk-v5';
import { v4 } from 'uuid';
import { ConfigService } from '@app/config';

export interface FileProfile {
  body: UploadBody;
  filename?: string;
  mimetype: string;
}

@Injectable()
export class ObjectStorageService {
  private readonly cos: COS;

  constructor(private readonly configService: ConfigService) {
    // 初始化对象存储
    this.cos = new COS({
      SecretId: this.configService.getTencentCloudSecretId(),
      SecretKey: this.configService.getTencentCloudSecretKey(),
    });
  }

  /**
   * 上传附件
   */
  async upload2COS(fileProfile: FileProfile) {
    const res = await this.cos.putObject({
      Bucket: this.configService.getTencentCloudBucket(),
      Region: this.configService.getTencentCloudRegion(),
      Key: fileProfile.filename || v4(),
      ContentType: fileProfile.mimetype,
      Body: fileProfile.body,
    });

    return `https://${res.Location}`;
  }
}
