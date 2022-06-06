import { ObjectStorageService } from '@app/object-storage';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/guard';

@Controller()
export class AppController {
  constructor(private readonly objectStorageService: ObjectStorageService) {}

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
