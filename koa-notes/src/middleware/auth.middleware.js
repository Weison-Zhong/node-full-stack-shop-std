const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");
const auth = async (ctx, next) => {
  const { authorization = "" } = ctx.request.header;
  const token = authorization.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, JWT_SECRET);
    ctx.state.user = user.dataValues;
  } catch (error) {
    console.log({ error });
    // 过期，无效等
    switch (error.name) {
      case "TokenExpiredError":
        ctx.app.emit("error", "token已过期", ctx);
        return; // 用break不行
      default:
        ctx.app.emit("error", "无效token", ctx);
        return;
    }
  }
  await next();
};

const hadAdminPermission = async (ctx, next) => {
  const { is_admin, id } = ctx.state.user;
  console.log({ is_admin });
  if (!is_admin) {
    console.error("该用户没有管理员权限", id);
    ctx.app.emit("error", "没有管理员权限", ctx);
    return;
  }
  await next();
};

module.exports = {
  auth,
  hadAdminPermission,
};
