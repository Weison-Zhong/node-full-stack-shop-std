const { DataTypes } = require("sequelize");

const seq = require("../db/seq");

const User = seq.define(
  "zd_user",
  {
    // 自动有id自增
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "用户名，唯一",
    },
    password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN, // tint1 ?
      allowNull: false,
      defaultValue: 0,
      comment: "1是管理员",
    },
  },
  {
    timestamps: false, // 关闭自动生成创建时间和更新时间
  }
);

// User.sync({ force: true }); // 加了force:true的话就算原有数据表也会删除它重新创建

module.exports = User;