import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID!"],
  },
  firstName: {
    type: String,
    required: [true, "Please provide first name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name!"],
  },
  profileImage: {
    type: String,
  },
  phone: {
    type: String,
    // required: [true, "Please provide phone number!"],
  },
  govId: {
    type: String,
    required: [true, "Please provide government ID!"],
  },
});

export default mongoose.model("Profile", ProfileSchema);