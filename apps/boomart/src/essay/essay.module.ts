import { Module } from '@nestjs/common';
import { EssayService } from './essay.service';
import { EssayResolver } from './essay.resolver';
import { ToggleModule } from '../toggle/toggle.module';

@Module({
  imports: [ToggleModule],
  providers: [EssayResolver, EssayService],
})
export class EssayModule {}
