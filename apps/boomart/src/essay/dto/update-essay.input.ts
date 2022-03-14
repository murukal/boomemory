import { CreateEssayInput } from './create-essay.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEssayInput extends PartialType(CreateEssayInput) {}
