const validator = (rules) => {
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules);
      // ctx.verifyParams({
      //   //   goods_id: {
      //   //     type: "number",
      //   //     required: true,
      //   //   },
      //   goods_id: "number", //简写
      // });
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: "1",
        message: "添加购物车失败",
        result: error,
      };
      return;
    }
    await next();
  };
};
module.exports = {
  validator,
};
