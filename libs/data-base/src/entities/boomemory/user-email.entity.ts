import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class UserEmail {
  @Field(() => String, {
    description: '地址',
  })
  @PrimaryColumn()
  address: string;

  @Field(() => Int, {
    description: '验证码',
  })
  @Column({
    zerofill: true,
    type: 'decimal',
    precision: 4,
    scale: 0,
  })
  captcha: number;

  @Field(() => Date, {
    description: '有效截止时间',
  })
  @Column()
  validTo: Date;

  @Field(() => Boolean, {
    description: '是否验证',
  })
  @Column({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  private generateCaptcha() {
    this.captcha = parseInt((Math.random() * 10000).toString());
    this.validTo = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
  }
}
