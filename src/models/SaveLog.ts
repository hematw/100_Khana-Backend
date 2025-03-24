import mongoose from "mongoose";

const saveLogSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const SaveLog = mongoose.model("SaveLog", saveLogSchema);

export default SaveLog;
