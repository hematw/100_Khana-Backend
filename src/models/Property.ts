import { Schema, Types, model } from "mongoose";
import User from "./User";

// title, description, numOfRooms, numOfBaths, kitchen, images,✅
// address(province, district), ✅
// facilities(AC, Electricity, Guard, Parking, Park)✅
// property-type, price, category(apartment, independent house,new)✅ , rating

const PropertySchema = new Schema(
  {
    // title: {
    //   type: String,
    //   maxLength: [140, "Title can Not be longer than 140 characters"],
    // },
    description: {
      type: [String],
    },
    owner: {
      type: Types.ObjectId,
      ref: User,
    },
    numOfLivingRooms: {
      type: Number,
      required: [true, "Please specify number of Living rooms"],
    },
    numOfBedRooms: {
      type: Number,
      required: [true, "Please specify number of Bedrooms"],
    },
    numOfKitchens: {
      type: Number,
      required: [true, "Please specify number of Kitchens"],
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
    area: {
      type: Number,
      required: [true, "Please provide Home area"],
    },
    facilities: {
      type: [{ type: Types.ObjectId, ref: "Facility" }],
    },
    category: {
      type: [{type:Types.ObjectId}],
      ref: "Category",
      required: [true, "Please specify home category"],
    },
    listingType: {
      type: [String],
      enum: ["rental", "sale", "mortgage"],
      required: true,
    },
    // Address fields here
    city: {
      type: Types.ObjectId,
      ref: "City",
      required: [true, "Please provide city"],
    },
    district: {
      type: Types.ObjectId,
      ref: "District",
      required: [true, "Please provide district"],
    },
    road: {
      type: String,
      required: [true, "Please provide street"],
    },
    street: {
      type: String,
      required: [true, "Please provide street"],
    },
    lng: {
      type: Number,
      required: [true, "Please provide longitude"],
    },
    lat: {
      type: Number,
      required: [true, "Please provide latitude"],
    },
    floor: {
      type: Number,
      required: [true, "Please specify Floor"],
    },
    totalFloors: {
      type: Number,
      required: [true, "Please specify number of total floors"],
    },
    views: {
      type: Number,
      default: 0,
    },
    saved: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Property", PropertySchema);
