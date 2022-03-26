import { InputType } from '@nestjs/graphql';
import { CreateToggleInput } from './create-toggle.input';

@InputType()
export class RemoveToggleInput extends CreateToggleInput {}
