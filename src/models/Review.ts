import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", ReviewSchema);
