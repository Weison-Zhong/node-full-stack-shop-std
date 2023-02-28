import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { USER_TOKEN_KEY, USER_VERSION_KEY } from 'src/common/contants/redis.contant';
import { SharedService } from 'src/shared/shared.service';
import { Payload } from './login.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class LoginService {
    constructor(
        private readonly sharedService: SharedService,
        @InjectRedis() private readonly redis: Redis,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async login(request: Request) {
        const { user } = request as any;
        const payload: Payload = { userId: user.userId, pv: 1 };
        //生成token
        let jwtSign = this.jwtService.sign(payload);
        //存储密码版本号，防止登录期间 密码被管理员更改后 还能继续登录
        await this.redis.set(`${USER_VERSION_KEY}:${user.userId}`, 1);
        //存储token, 防止重复登录问题，设置token过期时间(1天后 token 自动过期)，以及主动注销token。
        await this.redis.set(
            `${USER_TOKEN_KEY}:${user.userId}`,
            jwtSign,
            'EX',
            60 * 60 * 24,
        );
        return { token: jwtSign };
    }
}
