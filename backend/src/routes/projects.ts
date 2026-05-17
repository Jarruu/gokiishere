import { Hono } from "hono";
import * as projectController from "../controllers/project.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = new Hono();

router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);

router.post("/", authMiddleware, projectController.createProject);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);

export default router;
