import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '..';
import { TargetType } from './toggle.entity';

@ObjectType()
@Entity()
export class Comment extends CoreEntity {
  @Field(() => Int, { description: '创建人Id' })
  @Column()
  createdById: number;

  @Field(() => TargetType, {
    description: '目标类型',
  })
  @Column({
    type: 'enum',
    enum: TargetType,
  })
  targetType: TargetType;

  @Field(() => Number, {
    description: '目标Id',
  })
  @Column()
  targetId: number;

  @Field(() => String, {
    description: '评论内容',
  })
  @Column()
  content: string;

  @Field(() => Boolean, {
    description: '删除标识',
  })
  @Column({
    default: false,
  })
  isDeleted: boolean;
}
