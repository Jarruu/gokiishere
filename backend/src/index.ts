import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import { errorHandler } from "./middleware/error.js";
import swaggerDocs from "./utils/swagger.js";

const app = express();
const port = process.env.PORT;
if (!port) {
  throw new Error("PORT is not defined in environment variables.");
}

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Swagger Docs
swaggerDocs(app, port);

// Global Error Handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Gokiishere API is running!" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
