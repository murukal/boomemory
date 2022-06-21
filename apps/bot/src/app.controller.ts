import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 提供给webhook的post地址
   */
  @Post('webhook')
  webhook() {
    return this.appService.webhook();
  }
}
