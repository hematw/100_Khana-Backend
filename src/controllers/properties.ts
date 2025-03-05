import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler";
import Property from "../models/Property";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { JwtPayload } from "jsonwebtoken";

export const getProperty = asyncHandler(async (req: Request, res: Response) => {
  const { owner } = req.query;
  console.log(owner);
  res.json({ message: "I am from getProperty" });
});

export const createProperty = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const owner = req.user?.id;
    const imagesPath: string[] = [];
    
    console.log(req.file, req.files, req.body);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
  }
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
    const newProperty = await Property.create({
      ...req.body,
      owner,
      images: imagesPath,
    });
    res.status(201).json({ message: "New Property added", newProperty });
  }
);
