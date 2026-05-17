import type { Context } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";
import { loginSchema } from "../utils/validation.js";

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login as admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const login = async (c: Context) => {
  const validatedData = loginSchema.parse(await c.req.json());
  const { username, password } = validatedData;

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    throw new AppError("Waduh, usernamenya salah tuh", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new AppError("Passwordnya kurang tepat, coba lagi ya", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    jwtSecret,
    { expiresIn: "1d" },
  );

  return c.json({
    status: "success",
    data: { token, username: admin.username },
  });
};
