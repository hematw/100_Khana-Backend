import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const env = createEnv({
    server: {
        MONGO_STRING: z.string().min(1, {
            message: "❌ Missing MONGO_STRING in environment variables",
        }),
        PORT: z.preprocess(
            (val) => Number(val),
            z.number().min(1, {
                message: "❌ PORT must be a valid number greater than 0",
            })
        ),
        MY_JWT_SECRET: z.string().min(1, {
            message: "❌ Missing MY_JWT_SECRET in environment variables",
        }),
        SESSION_SECRET: z.string().min(1, {
            message: "❌ Missing SESSION_SECRET in environment variables",
        }),
        KEYCLOAK_REALM: z.string().min(1, {
            message: "❌ Missing KEYCLOAK_REALM in environment variables",
        }),
        KEYCLOAK_URL: z.string().min(1, {
            message: "❌ Missing KEYCLOAK_URL in environment variables",
        }),
        KEYCLOAK_SECRET: z.string().min(1, {
            message: "❌ Missing KEYCLOAK_SECRET in environment variables",
        }),
        KEYCLOAK_CLIENT_ID: z.string().min(1, {
            message: "❌ Missing KEYCLOAK_CLIENT_ID in environment variables",
        }),
        DATABASE_URL: z.string().min(1, {
            message: "❌ Missing DATABASE_URL in environment variables",
        }),
        ALLOWED_ORIGINS: z.string().min(1, {
            message: "❌ Missing ALLOWED_ORIGINS in environment variables",
        }),
    },
    runtimeEnv: {
        MONGO_STRING: process.env.MONGO_STRING,
        PORT: process.env.PORT,
        MY_JWT_SECRET: process.env.MY_JWT_SECRET,
        SESSION_SECRET: process.env.SESSION_SECRET,
        KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
        KEYCLOAK_URL: process.env.KEYCLOAK_URL,
        KEYCLOAK_SECRET: process.env.KEYCLOAK_SECRET,
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
        DATABASE_URL: process.env.DATABASE_URL,
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    },
});

export default env;
