import { registerAs } from '@nestjs/config';

export const cosConfig = registerAs('cos', () => ({
  bucket: process.env.BUCKET || '',
  region: process.env.REGION || '',
  secretId: process.env.SECRET_ID || '',
  secretKey: process.env.SECRET_KEY || '',
}));
