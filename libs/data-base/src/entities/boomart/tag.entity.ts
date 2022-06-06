import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, isURL, MaxLength } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
} from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Essay } from './essay.entity';

@ObjectType()
@Entity()
export class Tag extends CoreEntity {
  @Field(() => String, {
    description: '名称',
  })
  @Column()
  @IsString()
  @MaxLength(20)
  name: string;

  @Field(() => String, {
    description: '图片地址',
  })
  @Column()
  image: string;

  @ManyToMany(() => Essay, (essay) => essay.tags)
  essays: Essay[];

  @BeforeInsert()
  @BeforeUpdate()
  private validateImage() {
    if (this.image) return;
    if (!isURL(this.image)) throw new BadRequestException('');
  }
}
