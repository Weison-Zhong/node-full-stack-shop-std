const Router = require("koa-router");
const { add ,findAll} = require("../controller/carts.controller");
const router = new Router({ prefix: "/carts" });
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/carts.middleware");
router.post("/", auth, validator, add);
router.get("/", auth, findAll);
module.exports = router;
