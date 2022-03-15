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
import { User } from '../boomemory';
import { CoreEntity } from '../core.entity';
import { Tag } from './tag.entity';

@ObjectType()
@Entity()
export class Essay extends CoreEntity {
  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => User)
  @Column()
  createdby: number;

  @Field(() => String)
  @Column()
  cover: string;

  @ManyToMany(() => Tag, (tag) => tag.essays)
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