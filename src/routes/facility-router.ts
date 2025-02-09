import {
    createFacility,
    deleteFacility,
    getAllFacilities,
    getFacility,
    updateFacility,
  } from "@/controllers/facilities";
  import asyncHandler from "@/middlewares/async-handler";
  import { Router } from "express";
  
  const facilityRouter = Router();
  
  facilityRouter
    .get("/", asyncHandler(getAllFacilities))
    .get("/:id", asyncHandler(getFacility))
    .post("/", asyncHandler(createFacility))
    .put("/:id", asyncHandler(updateFacility))
    .delete("/:id", asyncHandler(deleteFacility));
  
  export default facilityRouter;
  