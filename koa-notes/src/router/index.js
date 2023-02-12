const fs = require("fs");
const Router = require("koa-router");
const router = new Router();
fs.readdirSync(__dirname).forEach((file) => {
  if (file === "index.js") {
    return;
  }
  const routerItem = require("./" + file);
  router.use(routerItem.routes());
});
module.exports = router;