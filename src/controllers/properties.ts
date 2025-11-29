import { Request, Response } from "express";
import asyncHandler from "../middlewares/async-handler.ts";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.ts";
import { NotFound } from "@/errors/index.ts";
import env from "@/env.ts";
import prisma from "@/db/prisma.ts";
import { PropertyWhereInput } from "generated/prisma/models.ts";

export const getProperties = asyncHandler(
    async (req: Request, res: Response) => {
        const { min_price, max_price, city, listingType, area, category } =
            req.query;

        const where: PropertyWhereInput = {};

        if (min_price && max_price) {
            where.price = { gte: +min_price, lte: +max_price };
        }
        if (listingType) {
            const listingTypesArray = (listingType as string).split(",");
            where.listingType = { in: listingTypesArray };
        }
        if (city) {
            where.city = city as string;
        }
        if (area) {
            where.area = { gte: +area - 20, lte: +area + 20 };
        }
        if (category) {
            // Assuming category is an ID or list of IDs.
            // If it's a single ID:
            // where.categories = { some: { id: category as string } };
            // If it's multiple:
            const categoryIds = (
                Array.isArray(category) ? category : [category]
            ) as string[];
            where.categoryId = { in: categoryIds };
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                category: true,
            },
        });

        res.json({ properties });
    }
);

export const createProperty = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const ownerId = req.user?.id;
        const imagesPath: string[] = [];

        if (!req.files || (req.files as any).length === 0) {
            return res.status(400).json({ message: "No files uploaded!" });
        }

        if (Array.isArray(req.files)) {
            req.files.forEach((file: Express.Multer.File) => {
                const imageUrl = `${req.protocol}://${req.hostname}:${
                    env.PORT
                }${
                    file.destination.replace("./public", "") +
                    "/" +
                    file.filename
                }`;
                imagesPath.push(imageUrl);
            });
        }

        // Parse single/multiple values
        let category = req.body.category;
        if (category && Array.isArray(category)) category = category[0]; // only one allowed

        let facilities = req.body.facilities;
        if (facilities && !Array.isArray(facilities)) {
            facilities = [facilities];
        }

        const newProperty = await prisma.property.create({
            data: {
                description: req.body.description,
                livingRooms: +req.body.numOfLivingRooms,
                bedrooms: +req.body.numOfBedRooms,
                kitchens: +req.body.numOfKitchens,
                baths: +req.body.numOfBaths,
                images: imagesPath,
                price: +req.body.price,
                area: +req.body.area,
                listingType: req.body.listingType,
                road: req.body.road,
                street: req.body.street,
                lng: +req.body.lng,
                lat: +req.body.lat,
                floor: +req.body.floor,
                totalFloors: +req.body.totalFloors,

                // Prisma 7 → Write foreign keys directly
                owner: ownerId,
                city: req.body.city,
                district: req.body.district,

                // Single category
                categoryId: category,

                // Many-to-many relation still uses connect
                facilities: facilities
                    ? { connect: facilities.map((id: string) => ({ id })) }
                    : undefined,
            },
        });

        res.status(201).json({ message: "New Property added", newProperty });
    }
);

export const getMyProperties = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?.id;

        const properties = await prisma.property.findMany({
            where: { owner: userId },
            include: {
                category: true,
            },
        });

        res.json({ properties });
    }
);

export const getPropertyById = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const propertyId = req.params.id;

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: {
                category: true,
                facilities: true,
                owner: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        profile: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!property) {
            throw new NotFound("Property not found");
        }

        const numberOfListedProperties = await prisma.property.count({
            where: { owner: property.owner },
        });

        // Similar properties
        const similarProperties = await prisma.property.findMany({
            where: {
                id: { not: propertyId },
                OR: [
                    { categoryId: property.categoryId },
                    { city: property.city },
                    {
                        price: {
                            gte: Number(property.price) * 0.8,
                            lte: Number(property.price) * 1.2,
                        },
                    },
                ],
            },
            take: 4,
            include: {
                city: true,
                district: true,
                category: true,
            },
        });

        res.json({
            ...property,
            owner: {
                ...property.owner,
                numberOfListedProperties,
            },
            similarProperties,
        });
    }
);
