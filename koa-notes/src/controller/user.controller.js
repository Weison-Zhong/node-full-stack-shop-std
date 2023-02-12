const userService = require("../service/user.service");
var jwt = require("jsonwebtoken");
const { getUserInfo, updateById } = require("../service/user.service");
const { JWT_SECRET } = require("../config/config.default");
class UserController {
  async register(ctx, next) {
    const { user_name, password } = ctx.request.body;
    try {
      const res = await userService.createUser(user_name, password);
      ctx.body = {
        code: 0,
        message: "注册成功",
        result: {
          id: res.id,
          user_name: res.user_name,
        },
      };
    } catch (error) {
      ctx.app.emit("error", "注册失败，请重试", ctx);
    }
  }
  async login(ctx, next) {
    const { user_name } = ctx.request.body;
    try {
      const { password, ...res } = await getUserInfo({ user_name });
      ctx.body = {
        code: "0",
        message: "登陆成功",
        result: {
          token: jwt.sign(res, JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      };
    } catch (error) {
      console.error("登陆失败", error);
      ctx.app.emit("error", "登陆失败，请重试", ctx);
    }
  }

  async changePassword(ctx, next) {
    const id = ctx.state.user.id;
    const { password } = ctx.request.body;
    if(await updateById({ id, password })){
      ctx.body = {
        code:'0',
        message:'修改密码成功'
      }
    } else {
      ctx.app.emit('error','修改密码失败')
    }
  }
}

module.exports = new UserController();
