import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userServices.findUser({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const verificationCode = nanoid();

    const avatarURL = gravatar.url(email);
    const newUser = await authServices.register({
      ...req.body,
      avatarURL,
      verificationCode,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify your email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const user = await userServices.findUser({ verificationCode });

    if (!user) {
      throw HttpError(404, "User not found");
    }
    await userServices.updateUser(
      { _id: user._id },
      { verify: true, verificationCode: "" }
    );
    res.json({
      message: "Verify success",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userServices.findUser({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify) {
      throw HttpError(400, "User is already verified");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify your email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
      message: "Verify email send success",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.findUser({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    if (!user.verify) {
      throw HttpError(401, "Email is not verified");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.setToken(user._id, token);

    res.json({
      user: { email: user.email, subscription: user.subscription },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await authServices.setToken(_id);

    res.json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
};

export const avatarUpdate = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsDir, filename);

    Jimp.read(oldPath, (err, lenna) => {
      if (err) throw err;
      lenna.resize(250, 250).write(newPath);
      fs.rm(oldPath);
    });
    const avatarURL = path.join("avatars", filename);

    await authServices.setAvatar(_id, avatarURL);
    return res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
