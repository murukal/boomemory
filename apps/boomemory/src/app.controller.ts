import { ObjectStorageService } from '@app/object-storage';
import { JwtAuthGuard } from '@app/passport/guard';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly objectStorageService: ObjectStorageService) {}

  /**
   * 上传文件
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.objectStorageService.upload2COS({
      body: file.buffer,
      mimetype: file.mimetype,
    });
  }
}
