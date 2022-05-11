import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../core.entity';

@ObjectType()
@Entity()
export class Billing extends CoreEntity {
  @Field(() => String, { description: '账本名称' })
  @Column()
  name: string;

  @Field(() => Int, { description: '账本创建人id' })
  @Column()
  createdById: number;
}
