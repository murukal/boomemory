import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { MaxLength } from 'class-validator';
import { Menu } from './menu.entity';

@ObjectType()
@Entity()
export class Tenant extends CoreEntity {
  @Field(() => String)
  @Column()
  @MaxLength(10)
  code: string;

  @Field(() => String)
  @Column()
  @MaxLength(20)
  name: string;

  @Field(() => [Menu])
  @OneToMany(() => Menu, (menu) => menu.tenant)
  menus: Menu[];
}
