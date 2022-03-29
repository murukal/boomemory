import { Comment } from '@app/data-base/entities/boomart/comment.entity';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput extends PickType(
  Comment,
  ['targetId', 'targetType', 'content'],
  InputType,
) {}
