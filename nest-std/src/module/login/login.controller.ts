import { Body, Controller, Post, Req, UseGuards,Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ReqLoginDto } from './dto/req-login.dto';

@ApiTags('登录')
@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() reqLoginDto: ReqLoginDto,
    @Req() req: Request
  ) {
    return await this.loginService.login(req)
  }

  /* 退出登录 */
  // @Public()
  @Post('logout')
  async logout(@Headers('Authorization') authorization: string) {
    console.log({authorization});
    if (authorization) {
      const token = authorization.slice(7);
      await this.loginService.logout(authorization);
    }
  }
}
