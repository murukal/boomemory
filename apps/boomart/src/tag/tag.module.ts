import { Global, Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { TopTagResolver } from './top-tag.resolver';
import { TagLoader } from './tag.loader';

@Global()
@Module({
  providers: [TagResolver, TopTagResolver, TagService, TagLoader],
  exports: [TagService],
})
export class TagModule {}
