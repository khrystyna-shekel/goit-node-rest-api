import express from "express";

import { register, login } from "../controllers/authController.js";

import validateBody from "../helpers/validateBody.js";

import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

export default authRouter;
