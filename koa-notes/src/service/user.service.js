const User = require("../model/user.model");
class UserService {
  async createUser(user_name, password) {
    const res = await User.create({
      user_name,
      password,
    });
    return res;
  }
  async getUserInfo({ id, user_name, password, is_admin }) {
    const whereOption = {};
    id && Object.assign(whereOption, { id });
    user_name && Object.assign(whereOption, { user_name });
    password && Object.assign(whereOption, { password });
    is_admin && Object.assign(whereOption, { is_admin });
    const res = await User.findOne({
      attributes: ["id", "user_name", "password", "is_admin"],
      where: whereOption,
    });
    return res ?? null;
  }
}

module.exports = new UserService();
