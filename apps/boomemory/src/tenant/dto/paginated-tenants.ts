import { Tenant } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedOptions } from 'utils/dto';

@ObjectType()
export class PaginatedTenants extends PaginatedOptions {
  @Field(() => [Tenant], {
    description: '租户列表',
  })
  items: Tenant[];
}
