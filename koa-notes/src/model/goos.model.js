const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const Goods = seq.define("zd_goods", {
  goods_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  goods_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  goods_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goods_img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
  paranoid:true // 软删除？ 
});

// Goods.sync({ force: true });
module.exports = Goods;
