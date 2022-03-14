import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, isURL, MaxLength } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Tenant } from './tenant.entity';

@ObjectType()
@Entity()
export class Menu extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @MaxLength(10)
  name: string;

  @Field(() => Int)
  @Column()
  sortBy: number;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  icon?: string;

  @Column({ nullable: true })
  tenantId: number;

  @Field(() => Tenant)
  @ManyToOne(() => Tenant, (tenant) => tenant.menus)
  tenant: Tenant;

  @Column({ nullable: true })
  parentId: number;

  @Field(() => Menu, { nullable: true })
  @ManyToOne(() => Menu, (menu) => menu.parent)
  parent: Menu;

  @Field(() => [Menu])
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @BeforeInsert()
  @BeforeUpdate()
  private validateIcon() {
    if (!this.icon) return;
    if (!isURL(this.icon))
      throw new BadRequestException('icon must be an URL address');
  }
}
