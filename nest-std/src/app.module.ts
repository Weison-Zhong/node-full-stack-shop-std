import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/defineConfig';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
    SharedModule,
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
