import { Schema, model } from "mongoose";

const FacilitiesSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide facility name"],
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
    required: [true, "Please provide facility icon"],
  },
});

export default model("Facility", FacilitiesSchema);
