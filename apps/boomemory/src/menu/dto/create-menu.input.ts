import { Menu } from '@app/data-base/entities';
import { PickType, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateMenuInput extends PickType(
  Menu,
  ['sortBy', 'name', 'icon'],
  ArgsType,
) {}
