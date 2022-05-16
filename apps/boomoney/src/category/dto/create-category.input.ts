import { Category } from '@app/data-base/entities/boomoney';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput extends PickType(
  Category,
  ['name', 'icon'],
  InputType,
) {}
