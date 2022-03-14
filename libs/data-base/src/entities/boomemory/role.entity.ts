import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Role extends CoreEntity {
  @Field(() => String)
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];
}
