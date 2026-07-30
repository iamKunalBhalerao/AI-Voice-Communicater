import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller";
import protect from "../../lib/middleware/auth.middleware";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);

export default authRouter;
