import { Field, InputType, Int } from '@nestjs/graphql';
import { TargetType, Type } from 'utils/dto/toggle-enum';

@InputType()
export class TopInput {
  @Field(() => Type, {
    description: '触发事件类型',
  })
  type: Type;

  @Field(() => Int, {
    description: '榜单数量',
  })
  limit: number;

  @Field(() => TargetType, {
    description: '目标类型',
  })
  targetType: TargetType;

  @Field(() => Date, {
    description: '起始时间',
  })
  from: Date;

  @Field(() => Date, {
    description: '截止时间',
  })
  to: Date;
}
