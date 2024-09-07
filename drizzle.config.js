import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schemas.js",
  out: './src/migrations',
};