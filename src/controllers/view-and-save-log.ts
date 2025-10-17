import Property from "@/models/Property.ts";
import SaveLog from "@/models/SaveLog.ts";
import ViewLog from "@/models/ViewLog.ts";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest.ts";
import { Response } from "express";

const trackPropertyView = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user!; // Add non-null assertion since req.user is defined for authenticated requests
  const ipAddress = req.ip;

  console.log(ipAddress, userId, id);

  const property = await Property.findById(id);
  if (!property) {
    return res.status(404).json({
      message: "Property not found",
    });
  }

  const viewLog = await ViewLog.findOne({
    propertyId:id,
    userId,
    ipAddress,
  });

  if (!viewLog) {
    await ViewLog.create({
      propertyId:id,
      userId,
      ipAddress,
    });
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  return res.status(200).json({
    message: "View logged successfully",
  });
};

const trackPropertySaved = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user!;
  const ipAddress = req.ip;

  const property = await Property.findById(id);
  if (!property) {
    return res.status(404).json({
      message: "Property not found",
    });
  }

  const saveLog = await SaveLog.findOne({
    propertyId: id,
    userId,
    ipAddress,
  });

  if (!saveLog) {
    await SaveLog.create({
      propertyId: id,
      userId,
      ipAddress,
    });

    await Property.findByIdAndUpdate(id, { $inc: { saved: 1 } });
  }else {
    await SaveLog.findByIdAndDelete(saveLog._id);
    await Property.findByIdAndUpdate(id, { $inc: { saved: -1 } });
  }


  return res.status(200).json({
    message: "Property saved successfully",
  });
};

export { trackPropertyView, trackPropertySaved };
