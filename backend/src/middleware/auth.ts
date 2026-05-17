import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export type AppVariables = {
  adminId: string;
};

export const authMiddleware = async (c: Context<{ Variables: AppVariables }>, next: Next) => {
  const token = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const decoded = jwt.verify(token, jwtSecret);
    c.set("adminId", (decoded as { id: string }).id);
    await next();
  } catch (error) {
    return c.json({ message: "Invalid token" }, 401);
  }
};
