import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
// import authRouter from "./routes/auth-router.ts";
import morgan from "morgan";

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
import swggaerJsDoc from "swagger-jsdoc";
import env from "./env.ts";

import session from "express-session";
import KeycloakConnect from "keycloak-connect";

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
const port = env.PORT || 3001;

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

// Session configuration
const memoryStore = new session.MemoryStore();
app.use(
    session({
        secret: env.SESSION_SECRET || "my-secret-key",
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);

const keycloak = new KeycloakConnect({ store: memoryStore }, {
    realm: env.KEYCLOAK_REALM,
    "auth-server-url": env.KEYCLOAK_URL,
    "ssl-required": "external",
    resource: env.KEYCLOAK_CLIENT_ID,
    "public-client": true,
    "confidential-port": 0,
    credentials: {
        secret: env.KEYCLOAK_SECRET || "YOUR_CLIENT_SECRET_HERE", // From Keycloak client credentials
    },
} as any);


// Route handlers
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("request body", req.body);
    // setTimeout(() => next(), 4000);
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.send("Wellcome to 100 khana API");
});

// app.use(keycloak.middleware());


// Auth routes
// app.use("/api/v1/auth", authRouter);
// app.use(keycloak.protect());

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
        app.listen(port, () =>
            console.log(`server is running on port ${port} 🆗`)
        );
    } catch (error) {
        console.error(error);
    }
};
start();
