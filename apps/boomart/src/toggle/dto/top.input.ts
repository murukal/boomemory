import { Type } from '@app/data-base/entities/boomart/toggle.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

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

  @Field(() => Date, {
    description: '起始时间',
  })
  from: Date;

  @Field(() => Date, {
    description: '截止时间',
  })
  to: Date;
}
