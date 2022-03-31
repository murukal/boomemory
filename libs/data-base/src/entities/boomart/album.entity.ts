import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import isURL from 'validator/lib/isURL';
import { CoreEntity } from '..';
// import { Collection } from '.';

@ObjectType()
@Entity()
export class Album extends CoreEntity {
  @Field(() => String, { description: '专辑名称' })
  @Column()
  name: string;

  @Field(() => String, { nullable: true, description: '封面地址' })
  @Column({ nullable: true })
  cover?: string;

  @BeforeInsert()
  @BeforeUpdate()
  private validateCover() {
    if (!this.cover) return;
    if (!isURL(this.cover))
      throw new BadRequestException('cover must be an url');
  }
}
