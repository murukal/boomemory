import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { isURL } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Tag } from './tag.entity';

@ObjectType()
@Entity()
export class Navigation extends CoreEntity {
  @Field(() => String, { description: '标题' })
  @Column()
  title: string;

  @Field(() => String, { description: '封面地址', nullable: true })
  @Column({
    nullable: true,
  })
  cover?: string;

  @Column()
  createdById: number;

  @ManyToMany(() => Tag, (tag) => tag.navigations)
  @JoinTable()
  tags: Tag[];

  @BeforeInsert()
  @BeforeUpdate()
  private validateCover() {
    if (!this.cover) return;
    if (!isURL(this.cover))
      throw new BadRequestException('cover must be an url');
  }
}
