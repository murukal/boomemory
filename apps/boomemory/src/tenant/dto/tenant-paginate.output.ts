import { Tenant } from '@app/data-base/entities';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateOptionsOutput } from 'utils/dto';

@ObjectType()
export class TenantPaginateOutput extends PaginateOptionsOutput {
  @Field(() => [Tenant], {
    description: '租户列表',
  })
  items: Tenant[];
}
