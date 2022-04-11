import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum AuthorizationResourceCode {
  Menu = 'menu',
  Tenant = 'tenant',
  Role = 'role',
  Dictionary = 'dictionary',
  DictionaryEnum = 'dictionary-enum',
}

registerEnumType(AuthorizationResourceCode, {
  name: 'AuthorizationResourceCode',
  description: '权限资源code',
});

@ObjectType()
@Entity()
export class AuthorizationResource {
  @Field(() => AuthorizationResourceCode, {
    description: '权限资源code',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: AuthorizationResourceCode,
  })
  @IsEnum(AuthorizationResourceCode)
  code: AuthorizationResourceCode;

  @Field(() => String, {
    description: '权限资源名称',
  })
  @Column()
  name: string;
}
