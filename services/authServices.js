import bcrypt from "bcrypt";
import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const register = async (data) => {
  const { password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPassword });
};

// export async function register(data) {
//   return User.create(data);
// }
