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
    console.log(userId);
    const profile = await Profile.findOne({userId}).populate("userId");
    if(!profile){
      return res.status(404).json({message: "Profile not found"});
    }
    res.json(profile);
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

          res.status(200).json(profile);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Failed to update profile" });
        }
      }
    }
  }
);
