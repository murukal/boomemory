import { Role } from '@app/data-base/entities/boomemory';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput extends PickType(Role, ['name'], InputType) {}
