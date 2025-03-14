import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler";
import Property from "../models/Property";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { JwtPayload } from "jsonwebtoken";
import { NotFound } from "@/errors";

export const getProperties = asyncHandler(async (req: Request, res: Response) => {
  const { price, search, listingType } = req.query;
  console.log(price, search, listingType);

  const properties = await Property.find().populate("city district category");

  res.json({ properties });
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

export const getMyHouses = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    const properties = await Property.find({ owner: userId }).populate(
      "city district category"
    );

    res.json({ properties });
  }
);

export const getPropertyById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId).populate(
      "city district category owner facilities"
    );
    if (!property) {
      throw new NotFound("Property not found");
    }
    res.json(property);
  }
);