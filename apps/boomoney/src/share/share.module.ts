import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareResolver } from './share.resolver';
import { ShareLoader } from './share.loader';

@Module({
  providers: [ShareResolver, ShareService, ShareLoader],
})
export class ShareModule {}
