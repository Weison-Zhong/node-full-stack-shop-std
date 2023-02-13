const path = require("path");
const {
  createOrUpdate,
  findCarts,
  updateCart,
  removeCarts,selectAllCarts
} = require("../service/carts.service");
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
  async update(ctx) {
    const { id } = ctx.request.params;
    const { number, selected } = ctx.request.body;
    console.log(number, selected);
    if (number === undefined && selected === undefined) {
      return ctx.app.emit("error", "number和selectd都为空", ctx);
    }
    const res = await updateCart({ id, number, selected });
    ctx.body = {
      code: "0",
      message: "ok",
      result: res,
    };
  }
  async remove(ctx) {
    const { ids } = ctx.request.body;
    const res = await removeCarts(ids);
    ctx.body = {
      code: "0",
      message: "okok",
      result: res,
    };
  }
  async selectAll(ctx) {
    const { id: user_id } = ctx.state.user;
    const res = await selectAllCarts(user_id);
    ctx.body = {
      code: "0",
      message: "okok",
      result: res,
    };
  }
}

module.exports = new CartsController();
