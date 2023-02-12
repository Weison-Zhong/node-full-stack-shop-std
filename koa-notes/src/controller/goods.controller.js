const path = require("path");
const {
  createGoods,
  updateGoods,
  removeGoods,
  findGoods,
} = require("../service/goods.service");
class GoodsController {
  async upload(ctx, next) {
    // file是前端formdata的key名字
    const { file } = ctx.request.files;
    const fileTypes = ["image/jpeg", "image/png"]; // 应该在formidable配置，因为走到这时文件已经上传保存了
    if (file) {
      if (!fileTypes.includes(file.mimetype)) {
        return ctx.app.emit("error", "文件格式不支持", ctx);
      }
      ctx.body = {
        code: "0",
        message: "上传成功",
        result: {
          goods_img: path.basename(file.filepath),
        },
      };
      console.log("aa");
    } else {
      ctx.app.emit("error", "上传图片失败", ctx);
      return;
    }
  }
  async create(ctx) {
    try {
      const res = await createGoods(ctx.request.body);
      ctx.body = {
        code: "0",
        message: "发布成功",
        result: res,
      };
    } catch (error) {
      console.log(error);
      return ctx.app.emit("error", "发布失败", ctx);
    }
  }
  async update(ctx) {
    try {
      const res = await updateGoods(ctx.params.id, ctx.request.body);
      if (res) {
        ctx.body = {
          code: "0",
          message: "修改成功",
        };
      }
    } catch (error) {
      console.log(error);
      return ctx.app.emit("error", "修改失败", ctx);
    }
  }
  async remove(ctx) {
    try {
      const res = await removeGoods(ctx.params.id);
      console.log({ res });
      if (res) {
        ctx.body = "done";
      } else {
        return ctx.app.emit("error", "该商品不存在", ctx);
      }
    } catch (error) {
      console.log(error);
      return ctx.app.emit("error", "该商品不存在", ctx);
    }
  }
  async findAll(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.query;
    const res = await findGoods(pageNum, pageSize);
    ctx.body = {
      code: "0",
      message: "dong",
      result: res,
    };
  }
}

module.exports = new GoodsController();
