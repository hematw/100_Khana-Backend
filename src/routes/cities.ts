import asyncHandler from "@/middlewares/async-handler";
import { Router } from "express";
import {
  getCity,
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
} from "@/controllers/cities";

const cityRouter = Router();

cityRouter
  .get("/", asyncHandler(getAllCities))
  .get("/:id", asyncHandler(getCity))
  .post("/", asyncHandler(createCity))
  .put("/:id", asyncHandler(updateCity))
  .delete("/:id", asyncHandler(deleteCity));

export default cityRouter;
