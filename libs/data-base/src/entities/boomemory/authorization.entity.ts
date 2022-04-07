import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Tenant } from '.';
import { CoreEntity } from '..';
import { registerEnumType } from '@nestjs/graphql';

export enum Resource {
  Menu = 'menu',
  Tenant = 'tenant',
  Role = 'role',
  Dictionary = 'dictionary',
  DictionaryEnum = 'dictionary-enum',
}

export enum Action {
  Create = 'create',
  Retrieve = 'retrieve',
  Update = 'update',
  Delete = 'delete',
}

registerEnumType(Resource, {
  name: 'AuthorizationResource',
  description: '权限资源',
});

registerEnumType(Action, {
  name: 'AuthorizationAction',
  description: '权限操作',
});

@Entity()
@Unique(['resource', 'action'])
@ObjectType({
  description: '权限',
})
export class Authorization extends CoreEntity {
  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Field(() => Resource, {
    description: '资源',
  })
  @Column({
    type: 'enum',
    enum: Resource,
  })
  @IsEnum(Resource)
  resource: Resource;

  @Field(() => Action, {
    description: '操作',
  })
  @Column({
    type: 'enum',
    enum: Action,
  })
  @IsEnum(Action)
  action: Action;
}
