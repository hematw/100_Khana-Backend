import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide Category name"],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Category", CategorySchema);
