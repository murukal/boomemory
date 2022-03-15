import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Tenant } from './tenant.entity';

@ObjectType()
@Entity()
export class Menu extends CoreEntity {
  @Field(() => String, { description: '名称' })
  @Column()
  @IsString()
  @MaxLength(10)
  name: string;

  @Field(() => Int, { description: '排序码' })
  @Column()
  sortBy: number;

  @Field(() => String, { nullable: true, description: '图标名称' })
  @Column({
    nullable: true,
  })
  icon?: string;

  @Field(() => Int, { description: '所属租户ID' })
  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.menus)
  tenant: Tenant;

  @Field(() => Int, { nullable: true, description: '上级菜单ID' })
  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Menu, (menu) => menu.children)
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children?: Menu[];
}
