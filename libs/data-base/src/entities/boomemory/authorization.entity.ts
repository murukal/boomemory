import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, Entity, Unique } from 'typeorm';
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
