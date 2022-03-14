import { Module } from '@nestjs/common';
import { BoomartController } from './boomart.controller';
import { BoomartService } from './boomart.service';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [TagModule],
  controllers: [BoomartController],
  providers: [BoomartService],
})
export class BoomartModule {}
