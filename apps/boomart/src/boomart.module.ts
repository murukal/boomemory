import { Module } from '@nestjs/common';
import { BoomartController } from './boomart.controller';
import { BoomartService } from './boomart.service';
import { TagModule } from './tag/tag.module';
import { EssayModule } from './essay/essay.module';
import { ToggleModule } from './toggle/toggle.module';

@Module({
  imports: [TagModule, EssayModule, ToggleModule],
  controllers: [BoomartController],
  providers: [BoomartService],
})
export class BoomartModule {}
