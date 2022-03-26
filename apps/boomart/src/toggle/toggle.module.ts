import { forwardRef, Module } from '@nestjs/common';
import { ToggleService } from './toggle.service';
import { ToggleResolver } from './toggle.resolver';
import { EssayModule } from '../essay/essay.module';

@Module({
  imports: [forwardRef(() => EssayModule)],
  providers: [ToggleResolver, ToggleService],
  exports: [ToggleService],
})
export class ToggleModule {}
