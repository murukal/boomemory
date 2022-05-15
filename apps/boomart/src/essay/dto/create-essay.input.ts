import { Essay } from '@app/data-base/entities/boomart';
import { Field, InputType, Int, PickType } from '@nestjs/graphql';

@InputType()
export class CreateEssayInput extends PickType(
  Essay,
  ['content', 'cover', 'title'],
  InputType,
) {
  @Field(() => [Int], {
    description: '标签ids',
  })
  tagIds: number[];
}
