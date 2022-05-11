import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum TargetType {
  Billing = 'billing',
  Transaction = 'transaction',
}

registerEnumType(TargetType, {
  name: 'ShareTargetType',
  description: '共享对象类型',
});

@ObjectType()
@Unique(['targetType', 'targetId', 'sharedById'])
@Entity()
export class Share {
  @Field(() => Int, {
    description: 'id唯一键',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => TargetType, {
    description: '共享对象类型',
  })
  @Column({
    type: 'enum',
    enum: TargetType,
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '共享对象id',
  })
  @Column()
  targetId: number;

  @Field(() => Int, {
    description: '共享人员id',
  })
  @Column()
  sharedById: number;
}
