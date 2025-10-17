import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "@/controllers/categories.ts";
import asyncHandler from "@/middlewares/async-handler.ts";
import { Router } from "express";

const categoryRouter = Router();

categoryRouter
  .get("/", asyncHandler(getAllCategories))
  .get("/:id", asyncHandler(getCategory))
  .post("/", asyncHandler(createCategory))
  .put("/:id", asyncHandler(updateCategory))
  .delete("/:id", asyncHandler(deleteCategory));

export default categoryRouter;
