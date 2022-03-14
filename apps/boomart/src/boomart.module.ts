import { Module } from '@nestjs/common';
import { BoomartController } from './boomart.controller';
import { BoomartService } from './boomart.service';
import { TagModule } from './tag/tag.module';
import { EssayModule } from './essay/essay.module';

@Module({
  imports: [TagModule, EssayModule],
  controllers: [BoomartController],
  providers: [BoomartService],
})
export class BoomartModule {}
