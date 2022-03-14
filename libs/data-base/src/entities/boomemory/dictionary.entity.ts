import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../core.entity';

@Entity()
@ObjectType()
export class Dictionary extends CoreEntity {
  @Field(() => String)
  @Column({
    unique: true,
  })
  code: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  sortBy: number;
}
