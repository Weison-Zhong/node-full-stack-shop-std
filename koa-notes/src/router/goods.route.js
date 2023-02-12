const Router = require("koa-router");
const {
  upload,
  create,
  update,
  remove,
  findAll,
} = require("../controller/goods.controller");
const router = new Router({ prefix: "/goods" });
const { auth, hadAdminPermission } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/goods.middleware");
router.post("/upload", auth, hadAdminPermission, upload);
router.post("/", auth, hadAdminPermission, validator, create);
router.put("/:id", auth, hadAdminPermission, validator, update);
router.delete("/:id", auth, hadAdminPermission, remove); //硬删除
router.post("/:id/off", auth, hadAdminPermission, remove); // 软删除 自动维护deletedAt时间字段
router.get("/", findAll); // 软删除 自动维护deletedAt时间字段

module.exports = router;
