import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../core.entity';
import { Billing } from './billing.entity';
import { Category } from './category.entity';

@ObjectType()
@Entity()
export class Transaction extends CoreEntity {
  @Field(() => Int, {
    description: '账本id',
  })
  @Column()
  billingId: number;

  @ManyToOne(() => Billing)
  billing: Billing;

  @Field(() => Int, {
    description: '分类id',
  })
  @Column()
  categoryId: number;

  @ManyToOne(() => Category)
  category: Category;

  @Field(() => Float, { description: '交易金额' })
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
  })
  amount: number;

  @Column()
  createdById: number;
}
