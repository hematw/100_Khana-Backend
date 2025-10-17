import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const env = createEnv({
  server: {
    MONGO_STRING: z.string().min(1),
    PORT: z.number().min(1),
    MY_JWT_SECRET: z.string().min(1),
  },
  runtimeEnv: {
    MONGO_STRING: process.env.MONGO_STRING,
    PORT: Number(process.env.PORT),
    MY_JWT_SECRET: process.env.MY_JWT_SECRET,
  },
});

export default env;
