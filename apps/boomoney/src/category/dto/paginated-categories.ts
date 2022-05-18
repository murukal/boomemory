import { Category } from '@app/data-base/entities/boomoney';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedCategories extends Paginated(Category) {}
