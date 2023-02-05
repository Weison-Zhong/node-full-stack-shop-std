const dotenv = require('dotenv');

dotenv.config(); // 自动读取.env的配置到process.env中

module.exports = process.env;