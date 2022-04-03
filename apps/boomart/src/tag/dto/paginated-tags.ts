import { Tag } from '@app/data-base/entities';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedTags extends Paginated(Tag) {}
