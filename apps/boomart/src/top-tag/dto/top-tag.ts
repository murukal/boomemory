import { Tag } from '@app/data-base/entities/boomart';
import { Field, Int, PickType, ObjectType, ArgsType } from '@nestjs/graphql';

@ObjectType()
export class TopTag extends PickType(Tag, ['id', 'name']) {
  @Field(() => Int, {
    description: '创作量',
  })
  creationCount: number;
}

@ObjectType()
export class DailyHeat {
  @Field(() => String, {
    description: '日期',
  })
  createdAtDate: string;

  @Field(() => Int, {
    description: '创作量',
  })
  creationCount: number;
}

@ArgsType()
export class TopTagArgs {
  @Field(() => Date, {
    description: '起始',
    nullable: true,
  })
  from?: Date;

  @Field(() => Date, {
    description: '截止',
    nullable: true,
  })
  to?: Date;
}
