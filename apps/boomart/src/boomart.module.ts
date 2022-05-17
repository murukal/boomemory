import { Module } from '@nestjs/common';
import { BoomartController } from './boomart.controller';
import { BoomartService } from './boomart.service';
import { TagModule } from './tag/tag.module';
import { EssayModule } from './essay/essay.module';
import { ToggleModule } from './toggle/toggle.module';
import { CommentModule } from './comment/comment.module';
import { AlbumModule } from './album/album.module';
import { CollectionModule } from './collection/collection.module';
import { TopTagModule } from './top-tag/top-tag.module';

@Module({
  imports: [
    TagModule,
    TopTagModule,
    EssayModule,
    ToggleModule,
    CommentModule,
    AlbumModule,
    CollectionModule,
  ],
  controllers: [BoomartController],
  providers: [BoomartService],
})
export class BoomartModule {}
