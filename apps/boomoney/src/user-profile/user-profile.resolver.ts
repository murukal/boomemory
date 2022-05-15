import { UserProfile } from '@app/data-base/entities/boomoney';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => UserProfile)
export class UserProfileResolver {}
