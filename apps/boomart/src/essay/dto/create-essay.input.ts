import { Essay } from '@app/data-base/entities';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateEssayInput extends PickType(
  Essay,
  ['content', 'cover', 'title'],
  InputType,
) {}
