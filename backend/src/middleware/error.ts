import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (err: unknown, c: Context) => {
  const error = err as {
    statusCode?: number;
    message?: string;
    name?: string;
    stack?: string;
    issues?: { message: string }[];
  };
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  const isZodError = err instanceof ZodError || error.name === "ZodError";
  if (isZodError && Array.isArray(error.issues)) {
    statusCode = 400;
    message = error.issues.map((issue) => issue.message).join(", ");
  }

  console.error(`[Error]: ${message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return c.json(
    {
      status: "error",
      statusCode,
      message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    },
    statusCode as ContentfulStatusCode,
  );
};
