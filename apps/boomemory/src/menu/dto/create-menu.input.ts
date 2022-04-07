import { Menu } from '@app/data-base/entities';
import { PickType, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMenuInput extends PickType(
  Menu,
  ['name', 'sortBy', 'icon', 'tenantCode', 'parentId', 'component', 'to'],
  InputType,
) {}
