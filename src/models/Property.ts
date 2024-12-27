import { Schema, Types, model } from "mongoose";
import User from "./User";

// title, description, numOfRooms, numOfBaths, kitchen, images,✅
// address(province, district), ✅
// facilities(AC, Electricity, Guard, Parking, Park)✅
// property-type, price, category(apartment, independent house,new)✅ , rating

const FacilitiesSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide facility name"],
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

const PropertySchema = new Schema({
  title: {
    type: String,
    maxLength: [140, "Title can Not be longer than 140 characters"],
  },
  description: {
    type: String,
  },
  owner: {
    type: Types.ObjectId,
    ref: User,
  },
  numOfRooms: {
    type: Number,
    required: [true, "Please specify number of rooms"],
  },
  numOfBaths: {
    type: Number,
    required: [true, "Please specify number of baths"],
  },
  images: {
    type: [String],
    // required: [true, "Please at least at 3 phots of your home"],
  },
  price: {
    type: Number,
    required: [true, "Please provide Home price"],
  },
  facilities: {
    type: [FacilitiesSchema],
  },
  category: {
    type: String,
    enum: ["apartment", "independent house", "new"],
    required: [true, "Please specify home category"],
  },
  listingType: {
    type: String,
    enum: ["Rental", "Sale", "Mortgage"], required: true  },
  city: {
    type: String,
    required: [true, "Please provide city"],
  },
  district: {
    type: String,
    required: [true, "Please provide district"],
  },
  street: {
    type: String,
    required: [true, "Please provide street"],
  },
});

export default model("Home", PropertySchema);
