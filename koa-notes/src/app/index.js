const Koa = require("koa");
const { koaBody } = require("koa-body");
const app = new Koa();

const userRouter = require("../router/user.route");

app.use(koaBody());
app.use(userRouter.routes());

//统一错误处理
app.on("error", (errMessage, ctx) => {
  ctx.status = 500;
  ctx.body = {
    code: "1",
    message: errMessage,
  };
});

module.exports = app;
