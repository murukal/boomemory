import { Tag } from '@app/data-base/entities';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateTagInput extends PickType(
  Tag,
  ['name', 'image'],
  InputType,
) {}
