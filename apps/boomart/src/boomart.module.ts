import { Module } from '@nestjs/common';
import { BoomartController } from './boomart.controller';
import { BoomartService } from './boomart.service';

@Module({
  imports: [],
  controllers: [BoomartController],
  providers: [BoomartService],
})
export class BoomartModule {}
