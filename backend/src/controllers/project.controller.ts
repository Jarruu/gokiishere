import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/error.js";
import { projectSchema } from "../utils/validation.js";
import { supabase } from "../lib/supabase.js";

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "All";
    const sortBy = (req.query.sortBy as string) || "Newest";
    
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };

    if (category !== "All") {
      where.category = category;
    }

    // Build orderBy
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

    res.json({
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by ID
 *     parameters:
 *       - name: id
 *         in: path
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
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new AppError("Invalid ID", 400);

    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) throw new AppError("Project not found", 404);
    res.json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: validatedData,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/projects/{id}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update a project (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new AppError("Invalid ID", 400);

    const validatedData = projectSchema.parse(req.body);

    // 1. If a new image is provided, find the old project to delete the old image
    if (validatedData.image) {
      const oldProject = await prisma.project.findUnique({
        where: { id },
      });

      if (oldProject && oldProject.image && oldProject.image !== validatedData.image) {
        try {
          const bucketName = "projects";
          const urlParts = oldProject.image.split(`/${bucketName}/`);
          if (urlParts.length > 1) {
            const oldFilePath = urlParts[urlParts.length - 1];
            console.log(`[storage]: Deleting old file during update: ${oldFilePath}`);
            await supabase.storage.from(bucketName).remove([oldFilePath]);
          }
        } catch (err) {
          console.error(`[storage]: Error deleting old file during update:`, err);
        }
      }
    }

    // 2. Update the project record
    const project = await prisma.project.update({
      where: { id },
      data: validatedData,
    });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new AppError("Invalid ID", 400);

    // 1. Find project to get the image URL
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) throw new AppError("Project not found", 404);

    // 2. If project has an image, delete it from Supabase Storage
    if (project.image) {
      try {
        // Extract file path from URL
        // Expected URL: https://.../storage/v1/object/public/[bucket-name]/[file-path]
        // We need everything after /[bucket-name]/
        const bucketName = "projects";
        const urlParts = project.image.split(`/${bucketName}/`);
        
        if (urlParts.length > 1) {
          const filePath = urlParts[urlParts.length - 1];
          console.log(`[storage]: Attempting to delete file: ${filePath}`);
          
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (storageError) {
            console.error(`[storage]: Error deleting file: ${storageError.message}`);
            // We continue anyway to ensure the DB record is deleted
          } else {
            console.log(`[storage]: File deleted successfully`);
          }
        }
      } catch (err) {
        console.error(`[storage]: Unexpected error during file deletion:`, err);
      }
    }

    // 3. Delete project from database
    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project and associated assets deleted successfully" });
  } catch (error) {
    next(error);
  }
};
