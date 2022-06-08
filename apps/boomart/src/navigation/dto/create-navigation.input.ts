import { Navigation } from '@app/data-base/entities/boomart';
import { InputType, Int, Field, PickType } from '@nestjs/graphql';

@InputType()
export class CreateNavigationInput extends PickType(
  Navigation,
  ['title', 'cover', 'createdById'],
  InputType,
) {
  @Field(() => [Int], {
    description: '标签ids',
  })
  tagIds: number[];
}
