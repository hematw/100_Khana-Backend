import { Schema, model } from "mongoose";

const FacilitiesSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide facility name"],
  },
  description: {
    type: String,
  },
});

export default model("Facility", FacilitiesSchema);
