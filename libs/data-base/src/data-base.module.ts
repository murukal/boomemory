import { Global, Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';
import {
  boomartConnection,
  boomartFeatures,
  boomemoryConnection,
  boomemoryFeatures,
  boomoneyConnection,
  boomoneyFeatures,
} from './entities';

@Global()
@Module({
  imports: [
    boomemoryConnection,
    boomartConnection,
    boomoneyConnection,
    boomemoryFeatures,
    boomartFeatures,
    boomoneyFeatures,
  ],
  providers: [DataBaseService],
  exports: [
    DataBaseService,
    boomemoryFeatures,
    boomartFeatures,
    boomoneyFeatures,
  ],
})
export class DataBaseModule {}
