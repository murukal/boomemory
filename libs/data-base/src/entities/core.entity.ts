import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @Field(() => Int, {
    description: 'id唯一键',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date, {
    description: '创建日期',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, {
    description: '上次更新日期',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
