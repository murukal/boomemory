import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Billing } from './billing.entity';

@ObjectType()
@Entity()
export class UserProfile {
  @PrimaryColumn()
  userId: number;

  @Field(() => Billing, {
    nullable: true,
    description: '默认账本',
  })
  @ManyToOne(() => Billing, {
    nullable: true,
  })
  defaultBilling: Billing;
}
