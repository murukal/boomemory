import { Menu } from '@app/data-base/entities';
import { PickType, InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMenuInput extends PickType(
  Menu,
  ['name', 'sortBy', 'icon'],
  InputType,
) {
  @Field(() => Int)
  tenantId: number;

  @Field(() => Int, { nullable: true })
  parentId?: number;
}
