import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Tenant } from './tenant.entity';

@ObjectType()
@Entity()
export class Menu extends CoreEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Int)
  @Column()
  sortBy: number;

  @Field(() => String)
  @Column()
  icon: string;

  @Field(() => Tenant)
  @ManyToOne(() => Tenant, (tenant) => tenant.menus)
  @JoinColumn()
  tenant: Tenant;

  @Field(() => Menu)
  @ManyToOne(() => Menu, (menu) => menu.parent)
  @JoinColumn()
  parent: Menu;

  @Field(() => [Menu])
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];
}
