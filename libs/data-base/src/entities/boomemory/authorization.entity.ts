import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Operation, Resource } from 'utils/dto/authorization-enum';
import { Tenant } from '.';
import { CoreEntity } from '..';

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
