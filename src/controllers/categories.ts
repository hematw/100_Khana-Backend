import { Response } from "express";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import Category from "@/models/Category";
import { NotFound } from "@/errors";

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({ message: "Category successfully created", category });
};

export const getAllCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const categories = await Category.find();
  res.json({ categories });
};

export const getCategory = async (req: AuthenticatedRequest, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new NotFound("Category not found");
  }
  res.json(category);
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new NotFound("Category not found");
  }
  res.json({ message: "Category successfully deleted" });
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new NotFound("Category not found");
  }
  res.json({ message: "Category successfully updated", category });
};
