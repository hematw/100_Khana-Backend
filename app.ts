import { config as dotEnvConfig } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./src/routes/auth-router";
import morgan from "morgan";
import connectDb from "./src/db/connect";
import errorHandler from "./src/middlewares/error-handler";
import authHandler from "./src/middlewares/auth-handler";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/users-router";
import propertiesRouter from "./src/routes/properties-router";
import categoryRouter from "@/routes/categories";
import cityRouter from "@/routes/cities";
import districtRouter from "@/routes/districts";

dotEnvConfig();
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.static("public"));

// Route handlers
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("request body", req.body);
  next();
});

// Auth routes
app.use("/api/v1/auth", authRouter);
app.use(authHandler);

// Users routes
app.use("/api/v1/users", userRouter);

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/districts", districtRouter);
app.use("/api/v1/properties", propertiesRouter);
app.use(errorHandler);

const start = async () => {
  try {
    if (process.env.MONGO_STRING) {
      await connectDb(process.env.MONGO_STRING);
      console.log("Database connected ✅");
      app.listen(port, () =>
        console.log(`server is running on port ${port} 🆗`)
      );
    }
  } catch (error) {}
};
start();
