import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../core.entity';

@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field(() => String, { description: '名称' })
  @Column()
  name: string;

  @Field(() => String, { description: '图标' })
  @Column()
  icon: string;
}
