import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { TargetType, Type } from 'utils/dto/toggle-enum';
import { CoreEntity } from '../core.entity';

@ObjectType()
@Entity()
export class Toggle extends CoreEntity {
  @Field(() => Int, { description: '创建人Id' })
  @Column()
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
