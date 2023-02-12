const { DataTypes } = require("sequelize");
const Goods = require("./goos.model");
const seq = require("../db/seq");

const Cart = seq.define("zd_carts", {
  goods_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  selected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

// Cart.sync({ force: true });
Cart.belongsTo(Goods, {
  foreignKey: "goods_id",
  as: "goods_info",
}); //因为zd_carts表中的goods_id字段是外键

module.exports = Cart;
