import { Global, Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';
import { boomemoryConnection, boomemoryFeatures } from './entities';

@Global()
@Module({
  imports: [boomemoryConnection, boomemoryFeatures],
  providers: [DataBaseService],
  exports: [DataBaseService, boomemoryFeatures],
})
export class DataBaseModule {}
