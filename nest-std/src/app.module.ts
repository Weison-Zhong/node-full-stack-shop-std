import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/defineConfig';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './module/role/role.module';
import { MenuModule } from './module/menu/menu.module';
import { DeptModule } from './module/dept/dept.module';
import { LoginModule } from './module/login/login.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
    SharedModule,
    LoginModule,
    UserModule,
    RoleModule,
    MenuModule,
    DeptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
