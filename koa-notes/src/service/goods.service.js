const Goods = require("../model/goos.model");
class GoodsService {
  async createGoods(goods) {
    const res = await Goods.create(goods);
    return res.dataValues;
  }
  async updateGoods(id, goods) {
    const res = await Goods.update(goods, {
      where: { id },
    });
    return res[0] > 0;
  }
  async removeGoods(id) {
    const res = await Goods.destroy({ where: { id } });
    console.log("res-->", res);
    return res > 0;
  }
  async findGoods(pageNum, pageSize) {
    // const res = await Goods.findAll({
    //   offset: (pageNum - 1) * pageSize,
    //   limit: pageSize * 1,
    // });
    // const total = await Goods.count();
    const { count, rows } = await Goods.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize * 1,
    });
    return {
      pageNum,
      pageSize,
      total:count,
      list: rows,
    };
  }
}

module.exports = new GoodsService();
