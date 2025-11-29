import { Response } from "express";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest.ts";
import prisma from "@/db/prisma.ts";
import { NotFound } from "@/errors/index.ts";

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description } = req.body;
  const category = await prisma.category.create({
    data: { name, description },
  });
  res.status(201).json({ message: "Category successfully created", category });
};

export const getAllCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const categories = await prisma.category.findMany();
  res.json({ categories });
};

export const getCategory = async (req: AuthenticatedRequest, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
  });
  if (!category) {
    throw new NotFound("Category not found");
  }
  res.json(category);
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Category successfully deleted" });
  } catch (error) {
    throw new NotFound("Category not found");
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, description },
    });
    res.json({ message: "Category successfully updated", category });
  } catch (error) {
    throw new NotFound("Category not found");
  }
};
