import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryColumn()
  userId: number;

  @Column()
  defaultBillingId: number;
}
