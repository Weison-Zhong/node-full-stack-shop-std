
import { Logger } from '@nestjs/common';

// 判断系统是否是开发环境
export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

// 根据环境变量判断使用配置
export default () => {
    let envConfig: any = {};
    try {
        envConfig = require(`./config.${process.env.NODE_ENV}`).default;
        //将文件上传路径绑定到环境变量上
        process.env.uploadPath = envConfig.uploadPath ?? '/upload';
    } catch (e) {
        const logger = new Logger('ConfigModule');
        logger.error(e);
    }

    // 返回环境配置
    return envConfig;
};