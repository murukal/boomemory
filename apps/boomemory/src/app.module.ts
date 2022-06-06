import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { AppResolver } from './app.resolver';
import { MenuModule } from './menu/menu.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { RoleModule } from './role/role.module';
import { initializeCommonModules } from 'utils/app/handlers';

@Module({
  imports: [
    // 公用服务模块
    ...initializeCommonModules(),

    // 项目服务模块
    TenantModule,
    AuthModule,
    MenuModule,
    DictionaryModule,
    DictionaryEnumModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
