import { Navigation } from '@app/data-base/entities/boomart';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedNavigations extends Paginated(Navigation) {}
