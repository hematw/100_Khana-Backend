import { Response } from "express";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest.ts";
import prisma from "@/db/prisma.ts";
import { NotFound } from "@/errors/index.ts";

export const createFacility = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, icon } = req.body;
  const facility = await prisma.facility.create({
    data: { name, description, icon },
  });
  res.status(201).json({ message: "Facility successfully created", facility });
};

export const getAllFacilities = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const facilities = await prisma.facility.findMany();
  res.json({ facilities });
};

export const getFacility = async (req: AuthenticatedRequest, res: Response) => {
  const facility = await prisma.facility.findUnique({
    where: { id: req.params.id },
  });
  if (!facility) {
    throw new NotFound("Facility not found");
  }
  res.json(facility);
};

export const deleteFacility = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await prisma.facility.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Facility successfully deleted" });
  } catch (error) {
    throw new NotFound("Facility not found");
  }
};

export const updateFacility = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, icon } = req.body;
  try {
    const facility = await prisma.facility.update({
      where: { id: req.params.id },
      data: { name, description, icon },
    });
    res.json({ message: "Facility successfully updated", facility });
  } catch (error) {
    throw new NotFound("Facility not found");
  }
};
