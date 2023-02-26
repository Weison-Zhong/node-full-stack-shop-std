
export default {
    jwt: {
        secret: process.env.JWT_SECRET || '123456',
    },
    database: {
        type: 'mysql', //数据库类型
        host: process.env.MYSQL_HOST || 'localhost', //数据库地址
        port: process.env.MYSQL_PORT || 3306, //数据库端口
        username: process.env.MYSQL_USERNAME || 'root', //数据库账号
        password: process.env.MYSQL_PASSWORD || '123456', //数据库密码
        database: process.env.MYSQL_DATABASE || 'nest1', //数据库名称
        autoLoadModels: true, //模型自动加载，无需在在配置处重复写实体。
        synchronize: false, //如果为true 自动加载的模型将被同步进数据库，生产环境要关闭，否则可能因为字段的删除而造成数据的丢失。
        logging: false, //是否启动日志记录
    },
    // redis 配置
    redis: {
        config: {
            url: 'redis://:123456@localhost:6379/0',
        },
    },
    //文件上传地址  例如： E:/upload/test
    uploadPath: '',

    // 是否演示环境
    isDemoEnvironment: false,
}
