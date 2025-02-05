import City from "@/models/City";
import { Response } from "express";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import { NotFound } from "@/errors";

export const createCity = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name } = req.body;
  const city = await City.create({ name });
  res.status(201).json({ message: "City successfully created", city });
};

export const getAllCities = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const cities = await City.find();
  res.json({ cities });
};

export const getCity = async (req: AuthenticatedRequest, res: Response) => {
  const city = await City.findById(req.params.id);
  if (!city) {
    throw new NotFound("City not found");
  }
  res.json(city);
};

export const deleteCity = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const city = await City.findByIdAndDelete(req.params.id);
  if (!city) {
    throw new NotFound("City not found");
  }
  res.json({ message: "City successfully deleted" });
};

export const updateCity = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name } = req.body;
  const city = await City.findByIdAndUpdate(
    req.params.id,
    { name },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!city) {
    throw new NotFound("City not found");
  }
  res.json({ message: "City successfully updated", city });
};
