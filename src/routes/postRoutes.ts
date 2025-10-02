import { Router, Request, Response } from "express";
import { PostController } from "../controllers/postController";


export function PostRoutes() {
  const routes = Router();

  // Rotas para Posts
  routes.get('/search', PostController.searchAll);
  routes.post('/', PostController.create);
  routes.get('/', PostController.getAll);
  routes.get('/:id', PostController.getById);
  routes.put('/:id', PostController.update);
  routes.delete('/:id', PostController.delete);

  return routes;

}
