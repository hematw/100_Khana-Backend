import { Response } from "express";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import Facility from "@/models/Facility";
import { NotFound } from "@/errors";

export const createFacility = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, icon } = req.body;
  const facility = await Facility.create({ name, description, icon });
  res.status(201).json({ message: "Facility successfully created", facility });
};

export const getAllFacilities = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const facilities = await Facility.find();
  res.json({ facilities });
};

export const getFacility = async (req: AuthenticatedRequest, res: Response) => {
  const facility = await Facility.findById(req.params.id);
  if (!facility) {
    throw new NotFound("Facility not found");
  }
  res.json(facility);
};

export const deleteFacility = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const facility = await Facility.findByIdAndDelete(req.params.id);
  if (!facility) {
    throw new NotFound("Facility not found");
  }
  res.json({ message: "Facility successfully deleted" });
};

export const updateFacility = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, icon } = req.body;
  const facility = await Facility.findByIdAndUpdate(
    req.params.id,
    { name, description, icon },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!facility) {
    throw new NotFound("Facility not found");
  }
  res.json({ message: "Facility successfully updated", facility });
};
