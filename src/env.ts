import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const env = createEnv({
  server: {
    MONGO_STRING: z
      .string()
      .min(1, { message: "❌ Missing MONGO_STRING in environment variables" }),
    PORT: z
      .preprocess(
        (val) => Number(val),
        z
          .number()
          .min(1, { message: "❌ PORT must be a valid number greater than 0" })
      ),
    MY_JWT_SECRET: z
      .string()
      .min(1, { message: "❌ Missing MY_JWT_SECRET in environment variables" }),
  },
  runtimeEnv: {
    MONGO_STRING: process.env.MONGO_STRING,
    PORT: process.env.PORT,
    MY_JWT_SECRET: process.env.MY_JWT_SECRET,
  },
});

export default env;
