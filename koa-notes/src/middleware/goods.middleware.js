const validator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      goods_name: {
        type: "string",
        required: true,
      },
      goods_price: {
        type: "number",
        required: true,
      },
      goods_num: {
        type: "number",
        required: true,
      },
      goods_img: {
        type: "string",
        required: true,
      },
    });
  } catch (error) {
    console.log(error);
    // return ctx.app.emit('error','发布失败',ctx)
    ctx.body = {
      code: "1",
      message: "发布商品失败",
      result: error,
    };
    return
  }
  await next();
};
module.exports = {
  validator,
};
