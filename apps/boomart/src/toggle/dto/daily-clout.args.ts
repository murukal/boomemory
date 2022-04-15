import {
  TargetType,
  Type,
} from '@app/data-base/entities/boomart/toggle.entity';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class DailyCloutArgs {
  @Field(() => Date, {
    description: '起始',
  })
  from: Date;

  @Field(() => Date, {
    description: '截止',
  })
  to: Date;

  @Field(() => Type)
  type: Type;

  @Field(() => TargetType)
  targetType: TargetType;
}

@ObjectType()
export class DailyClout {
  @Field(() => String, {
    description: '日期',
  })
  createdAtDate: string;

  @Field(() => Int, {
    description: '流量',
  })
  clout: number;
}
