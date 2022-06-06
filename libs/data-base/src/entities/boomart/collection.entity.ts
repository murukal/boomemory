import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../core.entity';

@ObjectType()
@Entity()
export class Collection extends CoreEntity {
  @Field(() => String, { description: '合辑名称' })
  @Column()
  name: string;
}
