import { Field, InputType, Int } from '@nestjs/graphql';
import { TargetType } from 'utils/dto/toggle-enum';

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
