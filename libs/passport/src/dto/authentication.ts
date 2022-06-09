import { User } from '@app/data-base/entities/boomemory';
import { PickType } from '@nestjs/graphql';

export class Authentication extends PickType(User, ['id']) {}
