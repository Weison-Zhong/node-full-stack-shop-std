const Router = require("koa-router");
const { register, login } = require("../controller/user.controller");
const router = new Router({ prefix: "/users" });
const {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
} = require("../middleware/user.middleware");
const { auth } = require("../middleware/auth.middleware");
router.post("/register", userValidator, verifyUser, cryptPassword, register);
router.post("/login", userValidator, verifyLogin, login);
router.patch("/", auth, (ctx, next) => {
  console.log(ctx.state.user);
  ctx.body = "修改成功";
});
module.exports = router;
