const path = require("path");
const { createOrUpdate, findCarts } = require("../service/carts.service");
class CartsController {
  async add(ctx) {
    const userId = ctx.state.user.id;
    const { goods_id } = ctx.request.body;
    try {
      const res = await createOrUpdate(userId, goods_id);
      ctx.body = {
        code: "0",
        message: "添加成功",
        result: res,
      };
    } catch (error) {
      console.log(error);
      return ctx.app.emit("error", "发布失败", ctx);
    }
  }
  async findAll(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.query;
    const res = await findCarts(pageNum, pageSize);
    ctx.body = {
      code: "0",
      message: "ok",
      result: res,
    };
  }
}

module.exports = new CartsController();
