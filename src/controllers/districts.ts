import { Response } from "express";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import District from "@/models/District";
import { NotFound } from "@/errors";

export const createDistrict = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, city } = req.body;
  const district = await District.create({ name, description, city });
  res.status(201).json({ message: "District successfully created", district });
};

export const getAllDistricts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const districts = await District.find();
  res.json({ districts });
};

export const getDistrict = async (req: AuthenticatedRequest, res: Response) => {
  const district = await District.findById(req.params.id);
  if (!district) {
    throw new NotFound("District not found");
  }
  res.json(district);
};

export const deleteDistrict = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const district = await District.findByIdAndDelete(req.params.id);
  if (!district) {
    throw new NotFound("District not found");
  }
  res.json({ message: "District successfully deleted" });
};

export const updateDistrict = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, city } = req.body;
  const district = await District.findByIdAndUpdate(
    req.params.id,
    { name, description, city },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!district) {
    throw new NotFound("District not found");
  }
  res.json({ message: "District successfully updated", district });
};
