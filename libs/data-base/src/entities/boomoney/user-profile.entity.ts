import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Billing } from './billing.entity';

@ObjectType()
@Entity()
export class UserProfile {
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Billing, {
    nullable: true,
  })
  defaultBilling: Billing;
}
