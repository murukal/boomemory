import { Comment, User } from '@app/data-base/entities';
import { UserService } from '@app/user';
import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Int,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { JwtAuthGuard } from 'apps/boomemory/src/auth/guard';
import { CurrentUser } from 'utils/decorator/current-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { FilterCommentInput } from './dto/filter-comment.input';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

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

  @Query(() => [Comment], {
    name: 'comments',
    description: '查询多个评论',
  })
  getComments(
    @Args('filterInput', { type: () => FilterCommentInput })
    filterInput: FilterCommentInput,
  ) {
    return this.commentService.getComments(filterInput);
  }

  @ResolveField('createdBy', () => User, {
    description: '评论人',
  })
  getCreatedBy(@Parent() comment: Comment) {
    return this.userService.getUser(comment.createdById);
  }
}
