import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";
import { projectSchema } from "../utils/validation.js";
import { saveUploadedImage, deleteImageFromStorage } from "../lib/upload.js";

const parseTechStack = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : value;
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const isFile = (value: unknown): value is File =>
  value instanceof File && value.size > 0;

const normalizeProjectPayload = async (c: Context) => {
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const body = await c.req.parseBody();
    const imageValue = body.image;
    const image = isFile(imageValue)
      ? await saveUploadedImage(imageValue)
      : imageValue;

    return {
      ...body,
      image,
      techStack: parseTechStack(body.techStack),
    };
  }

  const body = await c.req.json();
  return {
    ...body,
    techStack: parseTechStack(body.techStack),
  };
};

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           default: All
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: Newest
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *                     hasNextPage: { type: boolean }
 */
export const getAllProjects = async (c: Context) => {
  const page = parseInt(c.req.query("page") || "1", 10);
  const limit = parseInt(c.req.query("limit") || "10", 10);
  const search = c.req.query("search") || "";
  const category = c.req.query("category") || "All";
  const sortBy = c.req.query("sortBy") || "Newest";
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category !== "All") {
    where.category = category;
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "A-Z") orderBy = { title: "asc" };
  else if (sortBy === "Z-A") orderBy = { title: "desc" };
  else if (sortBy === "Oldest") orderBy = { createdAt: "asc" };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.project.count({ where }),
  ]);

  return c.json({
    data: projects,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    },
  });
};

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
export const getProjectById = async (c: Context) => {
  const id = c.req.param("id");

  const project = await prisma.project.findUnique({
    where: { id },
  });
  if (!project) throw new AppError("Project not found", 404);

  return c.json(project);
};

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               category: { type: string }
 *               image: { type: string, format: binary }
 *               description: { type: string }
 *               fullContent: { type: string }
 *               techStack: { type: string, description: "JSON string or comma separated" }
 *               completedIn: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
export const createProject = async (c: Context) => {
  const payload = await normalizeProjectPayload(c);
  const validatedData = projectSchema.parse(payload);
  if (!validatedData.image) throw new AppError("Image is required", 400);

  const project = await prisma.project.create({
    data: {
      ...validatedData,
      image: validatedData.image,
    },
  });

  return c.json(project, 201);
};

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update an existing project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               category: { type: string }
 *               image: { type: string, format: binary }
 *               description: { type: string }
 *               fullContent: { type: string }
 *               techStack: { type: string }
 *               completedIn: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
export const updateProject = async (c: Context) => {
  const id = c.req.param("id");
  const payload = await normalizeProjectPayload(c);
  const validatedData = projectSchema.parse(payload);
  const oldProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!oldProject) throw new AppError("Project not found", 404);

  if (validatedData.image !== oldProject.image && oldProject.image) {
    await deleteImageFromStorage(oldProject.image);
  }

  const project = await prisma.project.update({
    where: { id },
    data: validatedData,
  });

  return c.json(project);
};

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteProject = async (c: Context) => {
  const id = c.req.param("id");

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) throw new AppError("Project not found", 404);

  if (project.image) {
    await deleteImageFromStorage(project.image);
  }

  await prisma.project.delete({
    where: { id },
  });

  return c.json({
    message: "Project and associated assets deleted successfully",
  });
};
