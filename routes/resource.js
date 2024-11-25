import { Router } from "express";
import {
  createResource,
  deleteResource,
  getResource,
  getResources,
} from "../controllers/ResourceController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", isAuth, createResource);

router.get("/", isAuth, getResources);

router.get("/:id", isAuth, getResource);

router.delete("/:id", isAuth, deleteResource);

export default router;
