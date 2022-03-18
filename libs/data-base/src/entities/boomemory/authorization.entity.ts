import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Tenant } from '.';
import { CoreEntity } from '..';

enum Resource {
  menu = 'menu',
}

enum Operation {
  create = 'create',
  retrieve = 'retrieve',
  update = 'update',
  delete = 'delete',
}

registerEnumType(Resource, { name: 'Resource', description: '资源' });
registerEnumType(Operation, { name: 'Operation', description: '操作' });

@Entity()
@Unique(['resource', 'operation'])
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

  @Field(() => Operation, {
    description: '操作',
  })
  @Column({
    type: 'enum',
    enum: Operation,
  })
  @IsEnum(Operation)
  operation: Operation;
}
