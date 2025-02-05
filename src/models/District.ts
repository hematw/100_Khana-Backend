import { Schema, Types, model } from "mongoose";

const DistrictSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide District name"],
      unique:true
    },
    description: { type: String },
    city: {
      type: Types.ObjectId,
      ref: "City",
      required: [true, "Please provide City"],
    },
  },
  { timestamps: true }
);

export default model("District", DistrictSchema);
