import { Toggle } from '@app/data-base/entities';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateToggleInput extends PickType(
  Toggle,
  ['targetId', 'targetType', 'type'],
  InputType,
) {}
