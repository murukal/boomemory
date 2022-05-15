import { Resolver } from '@nestjs/graphql';
import { UserProfileService } from './user-profile.service';

@Resolver()
export class UserProfileResolver {
  constructor(private readonly userProfileService: UserProfileService) {}
}
