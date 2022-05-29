import { TargetType } from '@app/data-base/entities/boomoney/share.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RemoveShareInput {
  @Field(() => TargetType, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '目标id',
  })
  targetId: number;

  @Field(() => Int, {
    description: '分享id',
  })
  sharedById?: number;
}
