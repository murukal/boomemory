import { Global, Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';
import {
  boomartConnection,
  boomartFeatures,
  boomemoryConnection,
  boomemoryFeatures,
} from './entities';

@Global()
@Module({
  imports: [
    boomemoryConnection,
    boomartConnection,
    boomemoryFeatures,
    boomartFeatures,
  ],
  providers: [DataBaseService],
  exports: [DataBaseService, boomemoryFeatures, boomartFeatures],
})
export class DataBaseModule {}
