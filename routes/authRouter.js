import express from "express";

import {
  register,
  login,
  getCurrent,
  logout,
  avatarUpdate,
} from "../controllers/authController.js";

import validateBody from "../helpers/validateBody.js";

import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";

import authenticate from "../middlewares/authenticate.js";

import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  validateBody(registerSchema),
  register
);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  avatarUpdate
);

export default authRouter;
