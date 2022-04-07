import { ObjectStorageService } from '@app/object-storage';
import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  @Get()
  go2Playground(@Res() res: Response) {
    return this.appService.go2Playground(res);
  }

  /**
   * 上传文件
   */
  @Post('api/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.objectStorageService.upload2COS({
      body: file.buffer,
      mimetype: file.mimetype,
    });
  }
}
