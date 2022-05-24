import { Transaction } from '@app/data-base/entities/boomoney';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedTransactions extends Paginated(Transaction) {}
