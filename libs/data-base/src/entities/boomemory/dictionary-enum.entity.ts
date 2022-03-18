import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Dictionary } from './dictionary.entity';

@Entity()
@ObjectType()
export class DictionaryEnum extends CoreEntity {
  @Field(() => String)
  @Column()
  code: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  sortBy: number;

  @Field(() => Int, { description: '所属字典ID' })
  @Column()
  parentId: number;

  @ManyToOne(() => Dictionary, (dictionary) => dictionary.children)
  parent: Dictionary;
}
