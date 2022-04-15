import { Global, Module } from '@nestjs/common';
import { EssayService } from './essay.service';
import { EssayResolver } from './essay.resolver';
import { ToggleModule } from '../toggle/toggle.module';
import { EssayLoader } from './essay.loader';

@Global()
@Module({
  imports: [ToggleModule],
  providers: [EssayResolver, EssayService, EssayLoader],
  exports: [EssayService],
})
export class EssayModule {}
