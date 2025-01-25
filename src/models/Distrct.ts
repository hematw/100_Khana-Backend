import { Schema, Types, model } from "mongoose";

const DistrictSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide District name"],
    },
    description: { type: Types.ObjectId, ref: "City" },
  },
  { timestamps: true }
);

export default model("District", DistrictSchema);
