import { Module } from '@nestjs/common';
import { TagModule } from './tag/tag.module';
import { EssayModule } from './essay/essay.module';
import { ToggleModule } from './toggle/toggle.module';
import { CommentModule } from './comment/comment.module';
import { AlbumModule } from './album/album.module';
import { CollectionModule } from './collection/collection.module';
import { TopTagModule } from './top-tag/top-tag.module';
import { initializeCommonModules } from 'utils/app/handlers';
import { NavigationModule } from './navigation/navigation.module';

@Module({
  imports: [
    // 公用服务模块
    ...initializeCommonModules(),

    // 项目服务模块
    TagModule,
    TopTagModule,
    EssayModule,
    ToggleModule,
    CommentModule,
    AlbumModule,
    CollectionModule,
    NavigationModule,
  ],
})
export class BoomartModule {}
