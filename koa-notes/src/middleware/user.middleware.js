const bcrypt = require("bcryptjs");
const { getUserInfo } = require("../service/user.service");
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    ctx.app.emit("error", "用户名或密码为空", ctx);
    return;
  }
  await next();
};

const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body;
  try {
    const userinfo = await getUserInfo({ user_name });
    if (userinfo) {
      ctx.app.emit("error", "用户名已存在", ctx);
      return;
    }
  } catch (error) {
    ctx.app.emit("error", "系统错误", ctx);
  }

  await next();
};

const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;
  await next();
};

const verifyLogin = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  try {
    const userinfo = await getUserInfo({ user_name });
    if (!userinfo) {
      ctx.app.emit("error", "用户名不存在", ctx);
      return;
    }
    if (!bcrypt.compareSync(password, userinfo.password)) {
      ctx.app.emit("error", "密码错误", ctx);
      return;
    }
  } catch (error) {
    ctx.app.emit("error", "系统错误", ctx);
  }

  await next();
};

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
};
