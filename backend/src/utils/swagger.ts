import type { Hono } from "hono";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerUI } from "@hono/swagger-ui";
import pkg from "../../package.json" with { type: "json" };

const { version } = pkg;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gokiishere API Documentation",
      version,
      description: "API documentation for Gokiishere portfolio and project management system",
      contact: {
        name: "Jaeyi",
        email: "support@gokiishere.com",
      },
    },
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
          required: ["title", "category", "image", "description", "fullContent", "techStack", "completedIn"],
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", minLength: 3 },
            category: {
              type: "string",
              enum: ['WEB', 'APP', 'MACHINE_LEARNING', 'VERILOG_FSM', 'ARDUINO_IOT', 'ALGORITHM_FLOWCHART', 'OTHERS'],
            },

            image: { type: "string", format: "uri" },
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

function swaggerDocs(app: Hono, port: number | string) {
  app.get("/api-docs", swaggerUI({ url: "/api-docs.json" }));

  app.get("/api-docs.json", (c) => {
    return c.json(swaggerSpec);
  });
}

export default swaggerDocs;
