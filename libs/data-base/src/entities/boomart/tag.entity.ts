import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, isURL, MaxLength } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from '..';

@ObjectType()
@Entity()
export class Tag extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @MaxLength(20)
  name: string;

  @Field(() => String)
  @Column()
  image: string;

  @BeforeInsert()
  @BeforeUpdate()
  private validateImage() {
    if (this.image) return;
    if (!isURL(this.image)) throw new BadRequestException('');
  }
}
