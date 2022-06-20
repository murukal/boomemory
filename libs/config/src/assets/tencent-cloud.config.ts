import { registerAs } from '@nestjs/config';

export const cosConfig = registerAs('tencentCloud', () => ({
  bucket: process.env.BUCKET,
  region: process.env.REGION,
  secretId: process.env.TENCENT_CLOUD_SECRET_ID,
  secretKey: process.env.TENCENT_CLOUD_SECRET_KEY,
}));
