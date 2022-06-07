import { Injectable } from '@nestjs/common';
import child_process = require('child_process');

@Injectable()
export class BotService {
  /**
   * 利用git webhook执行服务器脚本
   */
  webhook() {
    // 执行服务器脚本
    return child_process.execSync('zx apps/bot/src/scripts/reload-serve.mjs');
  }
}
