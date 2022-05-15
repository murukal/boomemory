import { Essay } from '@app/data-base/entities/boomart';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedEssays extends Paginated(Essay) {}
