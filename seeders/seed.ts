import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Property from "../src/models/Property.ts"; // Ensure the path is correct
import connectDb from "../src/db/connect.ts"; // Ensure the path is correct
import env from "@/env.ts";

// Define a type for the Property object
interface PropertyData {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  numOfRooms: number;
  numOfBaths: number;
  images: string[];
  price: string;
  category: string;
  facilities: string;
  listingType: string;
  city: string;
  district: string;
  street: string;
}

// Connect to the database and seed data
const seedProperty = async (): Promise<void> => {
  const data: PropertyData[] = [];

  for (let i = 1; i <= 20; i++) {
    const obj: PropertyData = {
      title: faker.lorem.words({ min: 1, max: 3 }),
      description: faker.lorem.paragraph(1),
      owner: new mongoose.Types.ObjectId(), // Generates a valid ObjectId
      numOfRooms: faker.number.int({ min: 1, max: 3 }),
      numOfBaths: faker.number.int({ min: 1, max: 2 }),
      images: Array.from({ length: 3 }, () => faker.image.urlPicsumPhotos()),
      price: faker.commerce.price({ min: 400, max: 10000, symbol: "$" }),
      category: faker.helpers.arrayElement(["apartment", "independent house", "new"]),
      facilities: faker.helpers.arrayElement(["Pool", "Gym", "Parking", "Wi-Fi"]),
      listingType: faker.helpers.arrayElement(["Rental", "Sale", "Mortgage"]),
      city: faker.location.city(),
      district: faker.location.secondaryAddress(),
      street: faker.location.street(),
    };
    data.push(obj);
  }

  try {
    if (env.MONGO_STRING) {
      await connectDb(env.MONGO_STRING);
      console.log("Database connected ✅");
    } else {
      throw new Error("MONGO_STRING is not defined in the environment variables");
    }

    await Property.insertMany(data);
    console.log(`${data.length} properties seeded successfully ✅`);
  } catch (error) {
    console.error("Error seeding properties:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
seedProperty().catch((error) => console.error("Seeding failed:", error));
