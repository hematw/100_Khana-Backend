import { Response } from "express";
import asyncHandler from "../middlewares/async-handler.ts";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.ts";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/User.ts";
import env from "@/env.ts";

export const getUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    let userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  }
);
export const updateUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("file is here", req.file);
    if (typeof req.user === "object") {
      let userId: string = req.user?.id;
      if (userId) {
        try {
          await User.findByIdAndUpdate(userId, {
            email: req.body.email,
          });

          const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
          };

          const profileImagePath =
            `${req.protocol}://${req.hostname}:${env.PORT}` +
            files?.["profile"][0].destination
              .replace("./public", "")
              .concat("/" + files["profile"][0].filename);

          // const backgroundImagePath =
          //   `${req.protocol}://${req.hostname}:${env.PORT}` +
          //   files?.["background"][0].destination
          //     .replace("./public", "")
          //     .concat("/" + files["background"][0].filename);

          const user = await User.findByIdAndUpdate(
            userId,
            {
              profile: profileImagePath,
              // background: backgroundImagePath,
              ...req.body,
            },
            {
              new: true,
              runValidators: true,
              upsert: true,
            }
          );

          res.status(200).json(user);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Failed to update User" });
        }
      }
    }
  }
);
