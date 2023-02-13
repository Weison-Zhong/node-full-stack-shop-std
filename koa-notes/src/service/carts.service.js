const Cart = require("../model/cart.model");
const { Op } = require("sequelize");
const Goods = require("../model/goos.model");
class CartService {
  async createOrUpdate(user_id, goods_id) {
    const res = await Cart.findOne({
      where: {
        [Op.and]: {
          user_id,
          goods_id,
        },
        // user_id,
        // goods_id,
      },
    });
    if (res) {
      await res.increment("number");
      return await res.reload();
    } else {
      return await Cart.create({
        user_id,
        goods_id,
      });
    }
  }
  async findCarts(pageNum, pageSize) {
    const { count, rows } = await Cart.findAndCountAll({
      attributes: ["id", "number", "selected"],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize * 1,
      include: {
        model: Goods,
        as: "goods_info",
        attributes: ["id", "goods_name", "goods_price", "goods_img"],
      },
    });
    return {
      total: count,
      list: rows,
    };
  }
  async updateCart({ id, number, selected }) {
    const res = await Cart.findByPk(id);
    if (!res) return;
    if (number) {
      res.number = number;
    }
    if (selected !== undefined) {
      res.selected = selected;
    }
    return await res.save();
  }
  async removeCarts(ids) {
    return await Cart.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }
  async selectAllCarts(user_id) {
    return await Cart.update(
      { selected: true },
      {
        where: {
          user_id,
        },
      }
    );
  }
}

module.exports = new CartService();
