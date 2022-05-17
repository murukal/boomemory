import { Module } from '@nestjs/common';
import { TopTagLoader } from './top-tag.loader';
import { TopTagResolver } from './top-tag.resolver';
import { TopTagService } from './top-tag.service';

@Module({
  providers: [TopTagResolver, TopTagLoader, TopTagService],
})
export class TopTagModule {}
