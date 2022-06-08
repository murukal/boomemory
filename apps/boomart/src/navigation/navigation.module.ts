import { Module } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationResolver } from './navigation.resolver';
import { NavigationLoader } from './navigation.loader';

@Module({
  providers: [NavigationResolver, NavigationService, NavigationLoader],
})
export class NavigationModule {}
