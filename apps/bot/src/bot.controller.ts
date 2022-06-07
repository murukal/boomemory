import { Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  /**
   * 提供给webhook的post地址
   */
  @Post('webhook')
  webhook() {
    return this.botService.webhook();
  }
}
