import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { jwtConstants } from '../auth/auth.constants';
import { AuthModule } from '../auth/auth.module';
import { MenuModule } from '../menu/menu.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '168h' },
    }),
    AuthModule,
    UserModule,
    MenuModule,
  ],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule { }
