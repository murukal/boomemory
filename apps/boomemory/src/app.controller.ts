import { ObjectStorageService } from '@app/object-storage';
import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppService } from './app.service';

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
   * 后台管理界面
   */
  @Get()
  go2Admin(@Res() res: Response) {
    return res.redirect('http://admin.fantufantu.com');
  }

  /**
   * 上传文件
   */
  @Post('api/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.objectStorageService.upload2COS({
      body: file.buffer,
      mimetype: file.mimetype,
    });
  }
}
