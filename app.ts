import { config as dotEnvConfig } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./src/routes/auth-router";
import morgan from "morgan";
import connectDb from "./src/db/connect";
import errorHandler from "./src/middlewares/error-handler";
import authHandler from "./src/middlewares/auth-handler";
import cookieParser from "cookie-parser";
import profileRouter from "./src/routes/profile-router";
import homeRouter from "./src/routes/home-router";

dotEnvConfig();
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"))
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Route handlers
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("request body", req.body);
  next()
});

// Auth routes
app.use("/api/v1/auth", authRouter);
app.use(authHandler);

// Profile routes
app.use("/api/v1/profile", profileRouter);

app.use("/api/v1/homes", homeRouter)
app.use(errorHandler);

const start = async () => {
  try {
    if (process.env.MONGO_STRING) {
      await connectDb(process.env.MONGO_STRING);
      console.log("Database connected ✅")
    }
    app.listen(port, () => console.log(`server is running on port ${port} 🆗`));
  } catch (error) {}
};
start();
