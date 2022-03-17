import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class PaginateInput {
  @Field(() => Int, { defaultValue: 1, description: '当前页码' })
  @IsInt()
  page: number;

  @Field(() => Int, { description: '查询限制' })
  @IsInt()
  limit: number;
}
