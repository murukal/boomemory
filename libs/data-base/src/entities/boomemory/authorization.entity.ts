import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, Unique } from 'typeorm';
import { Tenant } from '.';
import { CoreEntity } from '..';
import { AuthorizationAction } from './authorization-action.entity';
import { AuthorizationResource } from './authorization-resource.entity';

@Entity()
@Unique(['tenant', 'resource', 'action'])
@ObjectType({
  description: '权限',
})
export class Authorization extends CoreEntity {
  @ManyToOne(() => Tenant, {
    nullable: false,
  })
  tenant: Tenant;

  @ManyToOne(() => AuthorizationResource, {
    nullable: false,
  })
  resource: AuthorizationResource;

  @ManyToOne(() => AuthorizationAction, {
    nullable: false,
  })
  action: AuthorizationAction;
}
