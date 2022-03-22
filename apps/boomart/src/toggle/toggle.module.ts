import { Module } from '@nestjs/common';
import { ToggleService } from './toggle.service';
import { ToggleResolver } from './toggle.resolver';

@Module({
  providers: [ToggleResolver, ToggleService],
})
export class ToggleModule {}
