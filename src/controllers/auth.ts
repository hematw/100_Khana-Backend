import asyncHandler from "../middlewares/async-handler";
import User from "../models/User";
import { CookieOptions, json, Request, Response } from "express";

const cookieOptions: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // seven days
  httpOnly: true,
  secure: true,
};

// Register route controller
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const createdUser = await User.create(req.body);
    const token = await createdUser.generateToken();
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        token,
        createdUser: { ...createdUser.toJSON(), password: undefined },
      });
  }
);

// Login route controller
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (foundUser && (await foundUser.isPasswordCorrect(password))) {
    const token = await foundUser.generateToken();
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ success: true, token });
  }
  return res.status(401).json({ message: "Email or password was wrong!" });
});

// Logout route controller
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json({ success: true, message: "Logged out successfully" });
});
