import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { ReqLoginDto } from './dto/req-login.dto';

@ApiTags('登录')
@Controller('login')
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
}
