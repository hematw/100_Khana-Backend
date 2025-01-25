import { Schema, model } from "mongoose";

const CitySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide City name"],
    },
  },
  { timestamps: true }
);

export default model("City", CitySchema);
