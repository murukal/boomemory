import { Tenant } from '@app/data-base/entities';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedTenants extends Paginated(Tenant) {}
