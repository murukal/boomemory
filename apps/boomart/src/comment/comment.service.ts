import { Comment, CONNECTION_BOOMART } from '@app/data-base/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentInput } from './dto/create-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment, CONNECTION_BOOMART)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /** 创建评论 */
  create(comment: CreateCommentInput, createdById: number) {
    return this.commentRepository.save(
      this.commentRepository.create({
        ...comment,
        createdById,
      }),
    );
  }

  /** 删除评论 */
  async remove(id: number) {
    return !!(
      await this.commentRepository
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .execute()
    ).affected;
  }
}
