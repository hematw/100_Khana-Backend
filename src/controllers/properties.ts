import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler";
import Property from "../models/Property";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { JwtPayload } from "jsonwebtoken";
import { NotFound } from "@/errors";

export const getProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const { min_price, max_price, city, listingType } = req.query;
    console.log(createFilter(req.query));
    const filter = createFilter(req.query);

    const properties = await Property.find(filter).populate(
      "city district category"
    );

    res.json({ properties });
  }
);

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

export const getMyProperties = asyncHandler(
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
    const property = await Property.findById(propertyId)
      .populate("city district category facilities")
      .populate({ path: "owner", select: "-password -govId" });
    if (!property) {
      throw new NotFound("Property not found");
    }

    const numberOfListedProperties = await Property.countDocuments({
      owner: (property?.owner as any)._id,
    });
    (property?.owner as any).numberOfListedProperties =
      numberOfListedProperties;
    console.log(numberOfListedProperties, property);
    // Find similar properties
    const similarProperties = await Property.find({
      $and: [
        { _id: { $ne: propertyId } }, // Exclude the current property
        {
          $or: [
            { category: property.category },
            { city: property.city },
            {
              price: {
                $gte: Number(property.price) * 0.8, // Properties within ±20% price range
                $lte: Number(property.price) * 1.2,
              },
            },
          ],
        },
      ],
    })
      .limit(4) // Limit to 4 similar properties
      .populate("city district category");

    res.json({
      ...property.toJSON(),
      owner: {
        ...property.owner.toJSON(),
        numberOfListedProperties, // Add it explicitly here
      },
      similarProperties,
    });
  }
);

function createFilter(query: any): Record<string, any> {
  const { min_price, max_price, city, listingType, area, category } = query;

  const filter: Record<string, any> = {};

  if (min_price && max_price) {
    filter.price = { $gte: +min_price, $lte: +max_price };
  }
  if (listingType) {
    const listingTypesArray = listingType.split(",");
    filter.listingType = { $in: listingTypesArray };
  }
  if (city) {
    filter.city = city;
  }
  if (area) {
    filter.area = { $gte: +area - 20, $lte: +area + 20 };
  }

  if (category) {
    filter.category = category;
  }

  return filter;
}
