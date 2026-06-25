
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (() => {
      const v = process.env["DATABASE_URL"];
      if (!v) throw new Error("DATABASE_URL is not set in environment");
      return v;
    })(),
  },
});
