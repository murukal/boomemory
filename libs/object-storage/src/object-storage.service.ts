import { Injectable } from '@nestjs/common';
import COS = require('cos-nodejs-sdk-v5');
import type { UploadBody } from 'cos-nodejs-sdk-v5';
import { v4 } from 'uuid';

export interface FileProfile {
  body: UploadBody;
  filename?: string;
  mimetype: string;
}

@Injectable()
export class ObjectStorageService {
  private readonly cos: COS;

  constructor() {
    this.cos = new COS({
      SecretId: 'AKIDfAOhlY4JGxNWOzJM7cqpWx70cwzlGUS8',
      SecretKey: 'QZR3OSFm20h7G9l59wRfdKkW3IHzQbU6',
    });
  }

  async upload2COS(fileProfile: FileProfile) {
    const res = await this.cos.putObject({
      Bucket: 'boomemory-1304340057',
      Region: 'ap-shanghai',
      Key: fileProfile.filename || v4(),
      ContentType: fileProfile.mimetype,
      Body: fileProfile.body,
    });

    return `https://${res.Location}`;
  }
}
