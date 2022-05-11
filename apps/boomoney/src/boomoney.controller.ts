import { Controller, Get } from '@nestjs/common';
import { BoomoneyService } from './boomoney.service';

@Controller()
export class BoomoneyController {
  constructor(private readonly boomoneyService: BoomoneyService) {}

  @Get()
  getHello(): string {
    return this.boomoneyService.getHello();
  }
}
