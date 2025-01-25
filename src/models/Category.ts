import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Category name"],
    },
    description: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Category", CategorySchema);
