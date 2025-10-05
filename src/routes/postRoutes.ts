import { Router } from "express";
import { PostController } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";

export function PostRoutes() {
  const routes = Router();

  // --- Rotas Públicas ---
  routes.get("/search", PostController.searchAll);
  routes.get("/", PostController.getAll);
  routes.get("/:id", PostController.getById);

  // --- Rotas Protegidas ---
  routes.post("/", authMiddleware, PostController.create);
  routes.put("/:id", authMiddleware, PostController.update);
  routes.delete("/:id", authMiddleware, PostController.delete);

  return routes;
}
