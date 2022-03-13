import { Controller, Get } from '@nestjs/common';
import { BoomartService } from './boomart.service';

@Controller()
export class BoomartController {
  constructor(private readonly boomartService: BoomartService) {}

  @Get()
  getHello(): string {
    return this.boomartService.getHello();
  }
}
