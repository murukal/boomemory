import { registerAs } from '@nestjs/config';
import { AppID } from 'utils/app/assets';

export const portConfig = registerAs('port', () => {
  // 子项目监听的端口不同，利用环境变量控制
  return {
    [AppID.Bot]: process.env.BOT_PORT || 3000,
    [AppID.Boomemory]: process.env.BOOMEMORY_PORT || 3100,
    [AppID.Boomart]: process.env.BOOMART_PORT || 3200,
    [AppID.Boomoney]: process.env.BOOMONEY_PORT || 3300,
  };
});
