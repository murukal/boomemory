import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
  };
});
