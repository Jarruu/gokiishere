import type { Hono } from "hono";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerUI } from "@hono/swagger-ui";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Membaca version dari package.json secara manual karena import json with type bisa bermasalah di beberapa environment
const packageJsonPath = path.resolve(__dirname, "../../package.json");
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const { version } = pkg;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gokiishere API Documentation",
      version,
      description:
        "API documentation for Gokiishere portfolio and project management system. \n\n### Catatan Deployment\nBackend ini menggunakan Supabase Storage untuk penyimpanan gambar dan PostgreSQL untuk database.",
      contact: {
        name: "Jaeyi",
        email: "support@gokiishere.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "Production/Relative",
      },
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
        description: "Local Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Project: {
          type: "object",
          required: [
            "title",
            "category",
            "image",
            "description",
            "fullContent",
            "techStack",
            "completedIn",
          ],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", minLength: 3 },
            category: {
              type: "string",
              enum: [
                "WEB",
                "APP",
                "MACHINE_LEARNING",
                "VERILOG_FSM",
                "ARDUINO_IOT",
                "ALGORITHM_FLOWCHART",
                "OTHERS",
              ],
            },
            image: {
              type: "string",
              format: "uri",
              description: "Public URL dari Supabase Storage",
            },
            description: { type: "string", minLength: 10 },
            fullContent: { type: "string", minLength: 20 },
            techStack: {
              type: "array",
              items: { type: "string" },
            },
            completedIn: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 3 },
            password: { type: "string", minLength: 6 },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                username: { type: "string" },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.ts", "./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Hono, _port: number | string) {
  // Setup Swagger UI di root path documentation
  app.get("/api-docs", swaggerUI({ url: "/api-docs.json" }));

  // Endpoint untuk JSON spec
  app.get("/api-docs.json", (c) => {
    return c.json(swaggerSpec);
  });
}

export default swaggerDocs;
