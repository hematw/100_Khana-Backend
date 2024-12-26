import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth";

const authRouter = Router()

authRouter.post("/login", loginUser)
authRouter.post("/register", registerUser)
authRouter.get("/logout", logoutUser)

export default authRouter;