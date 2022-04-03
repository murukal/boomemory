import { Tag } from '@app/data-base/entities';
import { Field, Int, PickType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TopTag extends PickType(Tag, ['id', 'name']) {
  @Field(() => Int, {
    description: '创作数',
  })
  creationCount: number;
}
