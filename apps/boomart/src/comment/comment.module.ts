import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentLoader } from './comment.loader';

@Module({
  providers: [CommentResolver, CommentService, CommentLoader],
})
export class CommentModule {}
