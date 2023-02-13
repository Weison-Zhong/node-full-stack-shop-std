const path = require("path");
const Koa = require("koa");
const parameter = require("koa-parameter");
const KoaStatic = require("koa-static");
const { koaBody } = require("koa-body");
const app = new Koa();
const router = require("../router");

app.use(
  koaBody({
    multipart: true, //支持文件上传
    formidable: {
      // option中的相对路径如'../upload'是相对当前进程 process.cwd()目录的 ，所以推荐使用绝对路径
      // __dirname -> 当前文件的绝对路径
      uploadDir: path.join(__dirname, "../upload"),
      keepExtensions: true, // 保留文件扩展名
    },
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"], //这些会自动把前端data挂载到request.body中
  })
);
app.use(KoaStatic(path.join(__dirname, "../upload")));
app.use(parameter(app));
app.use(router.routes()).use(router.allowedMethods());
//统一错误处理
app.on("error", (errMessage, ctx) => {
  ctx.status = 500;
  ctx.body = {
    code: "1",
    message: errMessage,
  };
});

module.exports = app;
