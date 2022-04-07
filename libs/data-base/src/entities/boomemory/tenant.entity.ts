import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { IsBoolean, MaxLength } from 'class-validator';
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

  @Field(() => Boolean, { description: '租户鉴权' })
  @Column({
    default: false,
  })
  @IsBoolean()
  isAuthorizate: boolean;

  @OneToMany(() => Menu, (menu) => menu.tenant)
  menus: Menu[];
}
