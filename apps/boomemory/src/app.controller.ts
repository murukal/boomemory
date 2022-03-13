import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  go2Playground(@Res() res: Response) {
    return this.appService.go2Playground(res);
  }
}
