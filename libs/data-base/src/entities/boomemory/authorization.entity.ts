import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Tenant } from '.';
import { CoreEntity } from '..';
import {
  AuthorizationAction,
  AuthorizationActionCode,
} from './authorization-action.entity';
import {
  AuthorizationResource,
  AuthorizationResourceCode,
} from './authorization-resource.entity';

@Entity()
@Unique(['tenant', 'resource', 'action'])
@ObjectType({
  description: '权限',
})
export class Authorization extends CoreEntity {
  @Column()
  tenantCode: string;

  @ManyToOne(() => Tenant, {
    nullable: false,
  })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: AuthorizationResourceCode,
  })
  resourceCode: AuthorizationResourceCode;

  @ManyToOne(() => AuthorizationResource, {
    nullable: false,
  })
  resource: AuthorizationResource;

  @Column({
    type: 'enum',
    enum: AuthorizationActionCode,
  })
  actionCode: AuthorizationActionCode;

  @ManyToOne(() => AuthorizationAction, {
    nullable: false,
  })
  action: AuthorizationAction;

  @Column({
    default: false,
  })
  isDeleted: boolean;
}
