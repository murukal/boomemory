import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../core.entity';

export enum Type {
  Browse = 'browse',
  Like = 'like',
  Collect = 'collect',
}

export enum TargetType {
  Essay = 'essay',
  Comment = 'comment',
}

registerEnumType(Type, {
  name: 'ToggleType',
  description: '事件类型',
});

registerEnumType(TargetType, {
  name: 'ToggleTargetType',
  description: '事件目标类型',
});

@ObjectType()
@Entity()
export class Toggle extends CoreEntity {
  @Field(() => Int, { description: '创建人Id', nullable: true })
  @Column({
    nullable: true,
  })
  createdById: number;

  @Field(() => Type, {
    description: '类型',
  })
  @Column({
    type: 'enum',
    enum: Type,
  })
  type: Type;

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
}
