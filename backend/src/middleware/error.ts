import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || 'Internal Server Error';

  // Handle Zod Validation Errors
  const isZodError = err instanceof ZodError || err?.name === 'ZodError';
  if (isZodError && Array.isArray(err?.errors)) {
    statusCode = 400;
    message = err.errors.map((e: any) => e.message).join(', ');
  }

  console.error(`[Error]: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Ensure we always return JSON to prevent the "Unexpected token <" error in frontend
  if (!res.headersSent) {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    });
  }
};
