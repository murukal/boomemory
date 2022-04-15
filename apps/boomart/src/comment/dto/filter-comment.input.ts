import { TargetType } from '@app/data-base/entities/boomart/toggle.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FilterCommentInput {
  @Field(() => TargetType, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '目标id',
  })
  targetId: number;
}
