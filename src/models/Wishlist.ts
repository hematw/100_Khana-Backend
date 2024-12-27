import mongoose, { mongo } from "mongoose";

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Wishlist", WishlistSchema);
