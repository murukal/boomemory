import { Menu } from '@app/data-base/entities';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedMenus extends Paginated(Menu) {}
