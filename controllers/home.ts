import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler";
import Home from "../models/Home";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { JwtPayload } from "jsonwebtoken";

export const getHome = asyncHandler(async (req: Request, res: Response) => {
  const { owner } = req.query;
  console.log(owner);
  res.json({ message: "I am from getHome" });
});

export const createHome = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const owner = req.user?.id;
    const imagesPath: string[] = [];

    if (Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        const imageUrl = `${req.protocol}://${req.hostname}:${
          process.env.PORT
        }${file.destination
          .replace("./public", "")
          .concat("/" + file.filename)}`;
        imagesPath.push(imageUrl);
      });
    }

    console.log(req.body);
    const newHome = await Home.create({
      ...req.body,
      owner,
      images: imagesPath,
    });
    res.status(201).json({ message: "New Home added", newHome });
  }
);
