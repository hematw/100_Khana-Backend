import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "@/controllers/categories";
import asyncHandler from "@/middlewares/async-handler";
import { Router } from "express";

const categoryRouter = Router();

categoryRouter
  .get("/", asyncHandler(getAllCategories))
  .get("/:id", asyncHandler(getCategory))
  .post("/", asyncHandler(createCategory))
  .put("/:id", asyncHandler(updateCategory))
  .delete("/:id", asyncHandler(deleteCategory));

export default categoryRouter;
