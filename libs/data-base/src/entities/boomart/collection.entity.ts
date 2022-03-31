import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '..';
import { Album } from '.';

@ObjectType()
@Entity()
export class Collection extends CoreEntity {
  @Field(() => String, { description: '合辑名称' })
  @Column()
  name: string;
}
