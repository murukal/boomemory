import type { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request } from 'express';

export const getDynamicCorsOptions = (
  req: Request,
  callback: CorsOptionsCallback,
) => {
  const origin = req.header('Origin');

  callback(null, {
    ...(origin && {
      origin,
    }),
    credentials: true,
  });
};
