import { Module } from '@nestjs/common';
import { EssayService } from './essay.service';
import { EssayResolver } from './essay.resolver';
import { ToggleModule } from '../toggle/toggle.module';

@Module({
  imports: [ToggleModule],
  providers: [EssayResolver, EssayService],
  exports: [EssayService],
})
export class EssayModule {}
