import { registerAs } from '@nestjs/config';
// import { generateKeyPairSync } from 'crypto';

export const rsaConfig = registerAs('rsa', () => {
  // 利用 crypto 生成公私密钥对
  // const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  //   modulusLength: 1024,
  //   publicKeyEncoding: {
  //     type: 'spki',
  //     format: 'pem',
  //   },
  //   privateKeyEncoding: {
  //     type: 'pkcs1',
  //     format: 'pem',
  //   },
  // });

  return {
    publicKey: process.env.RSA_PUBLIC_KEY,
    privateKey: process.env.RSA_PRIVATE_KEY,
  };
});
