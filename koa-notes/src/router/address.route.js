const Router = require("koa-router");
const {
  add,
  findAll,
  update,
  remove,
  selectAll,
} = require("../controller/carts.controller");
const router = new Router({ prefix: "/address" });
const { auth } = require("../middleware/auth.middleware");
const { validator } = require("../middleware/carts.middleware");
router.post("/", auth, validator({ goods_id: "number" }), add);
router.get("/", auth, findAll);
router.patch(
  "/:id",
  auth,
  validator({
    number: { type: "number", required: false },
    selected: { type: "bool", required: false },
  }),
  update
);
router.delete(
  "/",
  auth,
  validator({
    ids: { type: "array" },
  }),
  remove
);
router.post("/selectAll", auth, selectAll);
module.exports = router;
