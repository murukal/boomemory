import { registerAs } from '@nestjs/config';
import { v4 } from 'uuid';

export const jwtConfig = registerAs('jwt', () => ({
  secret: v4(),
}));
