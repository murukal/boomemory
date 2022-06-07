import type { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request } from 'express';

/**
 * 根据请求体生成动态的跨域选项
 */
export const getDynamicCorsOptions = (
  req: Request,
  callback: CorsOptionsCallback,
) => {
  // 返回对应的跨域options
  callback(null, {
    origin: true,
    credentials: true,
  });
};
