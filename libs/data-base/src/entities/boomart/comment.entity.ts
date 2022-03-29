import { ObjectType, Field, OmitType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Toggle } from '.';

@ObjectType()
@Entity()
export class Comment extends OmitType(Toggle, ['type'], ObjectType) {
  @Field(() => String, { description: '评论内容' })
  @Column()
  content: string;
}
