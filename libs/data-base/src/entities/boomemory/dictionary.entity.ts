import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { DictionaryEnum } from './dictionary-enum.entity';

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

  @Field(() => [DictionaryEnum])
  @OneToMany(() => DictionaryEnum, (dictionaryEnum) => dictionaryEnum.parent)
  children: DictionaryEnum[];
}
