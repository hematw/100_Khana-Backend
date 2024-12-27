import { Response } from "express";
import asyncHandler from "../middlewares/async-handler";
import Profile from "../models/Profile";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

export const getProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    let userId = req.params.id;
    if (userId === "me" && typeof req.user === "object") {
      userId = req.user?.id;
    }
    const profile = await Profile.findOne({ userId }).populate("userId");
    res.json({ success: true, profile });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("file is here", req.file);
    if (typeof req.user === "object") {
      let userId: JwtPayload = req.user?.id;
      if (userId) {
        try {
          await User.findByIdAndUpdate(userId, {
            email: req.body.email,
          });
          const profileImagePath =
            `${req.protocol}://${req.hostname}:${process.env.PORT}` +
            req.file?.destination
              .replace("./public", "")
              .concat("/" + req.file?.filename);
          const profile = await Profile.findOneAndUpdate(
            { userId },
            { userId, profileImage: profileImagePath, ...req.body },
            {
              new: true,
              runValidators: true,
              upsert: true,
            }
          ).populate("userId");
          if (!profile) {
            res
              .status(404)
              .json({ success: false, message: "Profile not found" });
          } else {
            res.json({ success: true, profile: profile });
          }
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ success: false, message: "Failed to update profile" });
        }
      }
    }
  }
);
