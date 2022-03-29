import { Comment, User } from '@app/data-base/entities';
import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Boolean, {
    description: '创建评论',
  })
  @UseGuards(JwtAuthGuard)
  createComment(
    @Args('createCommentInput') comment: CreateCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentService.create(comment, user.id);
  }

  @Mutation(() => Boolean, {
    description: '删除评论',
  })
  @UseGuards(JwtAuthGuard)
  removeComment(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.remove(id);
  }
}
