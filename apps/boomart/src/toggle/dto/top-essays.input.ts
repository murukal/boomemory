import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'utils/dto/toggle-enum';

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
}
