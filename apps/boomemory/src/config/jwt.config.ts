import { registerAs } from '@nestjs/config';
import { v4 } from 'uuid';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || v4(),
}));
