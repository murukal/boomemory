import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { CoreEntity } from '../core.entity';
import { hashSync } from 'bcrypt';
import { IsEmail, MaxLength, MinLength, isURL } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Role } from './role.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(() => String)
  @Column({
    unique: true,
  })
  @MaxLength(20)
  username: string;

  @Field(() => String)
  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  avatar?: string;

  @Field(() => String)
  @Column({
    select: false,
  })
  @MaxLength(20)
  @MinLength(6)
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    if (!this.password) return;
    this.password = hashSync(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  private validatePassword() {
    if (!this.password) return;
    if (
      !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/.test(
        this.password,
      )
    )
      throw new BadRequestException(
        '密码必须包含大写字母，小写字母，数据，特殊符号中任意三项！',
      );
  }

  @BeforeInsert()
  @BeforeUpdate()
  private validateAvatar() {
    if (!this.avatar) return;
    if (!isURL(this.avatar))
      throw new BadRequestException('avatar must be an URL address');
  }
}
