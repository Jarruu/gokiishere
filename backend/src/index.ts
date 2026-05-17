import dotenv from "dotenv";
dotenv.config();

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import { errorHandler } from "./middleware/error.js";
import swaggerDocs from "./utils/swagger.js";

const app = new Hono();
const port = process.env.PORT;
if (!port) {
  throw new Error("PORT is not defined in environment variables.");
}
const baseUrl = `http://localhost:${port}`;

app.use("*", cors());
app.use("/uploads/*", serveStatic({ root: "./" }));

app.route("/api/auth", authRoutes);
app.route("/api/projects", projectRoutes);

swaggerDocs(app, port);

app.get("/", (c) => {
  return c.json({ message: "Gokiishere API is running!" });
});

app.onError(errorHandler);

serve({
  fetch: app.fetch,
  port: Number(port),
}, () => {
  console.log(`[server]: Server berjalan di ${baseUrl}`);
  console.log(`[swagger]: Docs tersedia di ${baseUrl}/api-docs`);
});
