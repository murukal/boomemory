import { Comment } from '@app/data-base/entities/boomart';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppID } from 'utils/application';
import { CreateCommentInput } from './dto/create-comment.input';
import { FilterCommentInput } from './dto/filter-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment, APP_ID_BOOMART)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /** 创建评论 */
  async create(comment: CreateCommentInput, createdById: number) {
    return !!(await this.commentRepository.save(
      this.commentRepository.create({
        ...comment,
        createdById,
      }),
    ));
  }

  /** 删除评论 */
  async remove(id: number) {
    return !!(
      await this.commentRepository
        .createQueryBuilder()
        .update()
        .set({
          isDeleted: true,
        })
        .whereInIds(id)
        .execute()
    ).affected;
  }

  /**
   * 查询多个评论
   */
  async getComments(filterInput: FilterCommentInput) {
    return await this.commentRepository
      .createQueryBuilder()
      .where('targetType = :targetType', {
        targetType: filterInput.targetType,
      })
      .andWhere('targetId = :targetId', {
        targetId: filterInput.targetId,
      })
      .andWhere('isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .getMany();
  }
}
