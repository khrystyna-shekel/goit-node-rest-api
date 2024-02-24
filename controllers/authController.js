import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const newUser = await authServices.register(req.body);

    res.status(201).json({
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};
