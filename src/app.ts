import { config as dotEnvConfig } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth-router.ts";
import morgan from "morgan";
import connectDb from "./db/connect.ts";
import errorHandler from "./middlewares/error-handler.ts";
import authHandler from "./middlewares/auth-handler.ts";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users-router.ts";
import propertiesRouter from "./routes/properties-router.ts";
import categoryRouter from "@/routes/categories.ts";
import cityRouter from "@/routes/cities.ts";
import districtRouter from "@/routes/districts.ts";
import facilityRouter from "@/routes/facility-router.ts";

import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import swggaerJsDoc from "swagger-jsdoc"
import env from "./env.ts";

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    inf: {
      title: "100 Khana API",
      version: "1.0.0",
      description: "API documentation for 100 Khana application",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggetSpecs = swggaerJsDoc(swaggerOptions);

const app = express();
const port = env.PORT || 3000;
  

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggetSpecs));

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
  // setTimeout(() => next(), 4000);
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
app.use("/api/v1/facilities", facilityRouter);
app.use(errorHandler);

const start = async () => {
  try {
    if (env.MONGO_STRING) {
      await connectDb(env.MONGO_STRING);
      console.log("Database connected ✅");
      app.listen(port, () =>
        console.log(`server is running on port ${port} 🆗`)
      );
    }
  } catch (error) {}
};
start();
