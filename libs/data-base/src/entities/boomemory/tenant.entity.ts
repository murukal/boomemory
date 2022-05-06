import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MaxLength } from 'class-validator';
import { Menu } from './menu.entity';

@ObjectType({
  description: '租户',
})
@Entity()
export class Tenant {
  @Field(() => String, { description: '租户代码' })
  @PrimaryColumn()
  @MaxLength(10)
  code: string;

  @Field(() => String, { description: '租户名称' })
  @Column()
  @MaxLength(20)
  name: string;

  @OneToMany(() => Menu, (menu) => menu.tenant)
  menus: Menu[];
}
