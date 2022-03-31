import { ObjectType, Field } from '@nestjs/graphql';
import { OneToMany } from 'typeorm';
import { CoreEntity } from '..';
import { Album } from '.';

@ObjectType()
export class Group extends CoreEntity {
  @Field(() => String, { description: '合辑名称' })
  name: string;
}
