import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isPasswordCorrect(plainPassword: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Please provide first name!"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name!"],
    },
    phone: {
      type: String,
      // required: [true, "Please provide phone number!"],
    },
    govId: {
      type: String,
      // required: [true, "Please provide government ID!"],
    },
    profile: {
      type: String, 
    },
    background: {
      type: String, 
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

User.methods.isPasswordCorrect = async function (
  plainPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

User.methods.generateToken = async function () {
  const jwtSecret = process.env.MY_JWT_SECRET;
  return await jwt.sign(
    { id: this._id, username: this.username },
    jwtSecret || "I AM NOT SECURE"
  );
};

export default mongoose.model<IUser>("User", User);
