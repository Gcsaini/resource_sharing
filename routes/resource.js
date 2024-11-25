import { Router } from "express";
import {
  createResource,
  deleteResource,
  getResource,
  getResourceByToken,
  getResources,
} from "../controllers/ResourceController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import validateAccessToken from "../middlewares/validateToken.js";

const router = Router();

router.post("/", isAuth, createResource);

router.get("/", isAuth, getResources);

router.get("/:id", isAuth, getResource);

router.get("/share/:token", validateAccessToken, getResourceByToken);

router.delete("/:id", isAuth, deleteResource);

export default router;
