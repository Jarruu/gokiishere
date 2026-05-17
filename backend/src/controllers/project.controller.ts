import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";
import { projectSchema } from "../utils/validation.js";
import path from "path";
import fs from "fs";
import { saveUploadedImage, uploadDir } from "../lib/upload.js";

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
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

const isFile = (value: unknown): value is File => value instanceof File && value.size > 0;

const normalizeProjectPayload = async (c: Context) => {
  const contentType = c.req.header("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const body = await c.req.parseBody();
    const imageValue = body.image;
    const image = isFile(imageValue) ? await saveUploadedImage(imageValue) : imageValue;

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
      { title: { contains: search } },
      { description: { contains: search } },
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

export const getProjectById = async (c: Context) => {
  const id = c.req.param("id");

  const project = await prisma.project.findUnique({
    where: { id },
  });
  if (!project) throw new AppError("Project not found", 404);

  return c.json(project);
};

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

export const updateProject = async (c: Context) => {
  const id = c.req.param("id");
  const payload = await normalizeProjectPayload(c);
  const validatedData = projectSchema.parse(payload);
  const oldProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!oldProject) throw new AppError("Project not found", 404);

  if (validatedData.image !== oldProject.image && oldProject.image) {
    try {
      const oldFilePath = path.join(uploadDir, path.basename(oldProject.image));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    } catch (err) {
      console.error(`[storage]: Error deleting old file during update:`, err);
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data: validatedData,
  });

  return c.json(project);
};

export const deleteProject = async (c: Context) => {
  const id = c.req.param("id");

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) throw new AppError("Project not found", 404);

  if (project.image) {
    try {
      const filePath = path.join(uploadDir, path.basename(project.image));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`[storage]: Error deleting file:`, err);
    }
  }

  await prisma.project.delete({
    where: { id },
  });

  return c.json({ message: "Project and associated assets deleted successfully" });
};
