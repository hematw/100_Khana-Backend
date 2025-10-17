import asyncHandler from "@/middlewares/async-handler.ts";
import { Router } from "express";
import {
  getDistrict,
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "@/controllers/districts.ts";

const districtRouter = Router();

districtRouter
  .get("/", asyncHandler(getAllDistricts))
  .get("/:id", asyncHandler(getDistrict))
  .post("/", asyncHandler(createDistrict))
  .put("/:id", asyncHandler(updateDistrict))
  .delete("/:id", asyncHandler(deleteDistrict));

export default districtRouter;
