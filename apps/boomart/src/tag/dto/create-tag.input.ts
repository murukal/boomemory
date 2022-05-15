import { Tag } from '@app/data-base/entities/boomart';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateTagInput extends PickType(
  Tag,
  ['name', 'image'],
  InputType,
) {}
