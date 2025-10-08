import { Router } from "express";
import { PostController } from "../controllers/postController";
import { PostRepository } from "../repositories/postRepository";

// 1. Instanciamos o repositório
const postRepository = new PostRepository();

// 2. Instanciamos o controller, passando o repositório para ele
const postController = new PostController(postRepository);

export function PostRoutes() {
  const routes = Router();

  // 3. As rotas agora chamam os métodos da *instância* do controller
  routes.get('/search', postController.searchAll);
  routes.post('/', postController.create);
  routes.get('/', postController.getAll);
  routes.get('/:id', postController.getById);
  routes.put('/:id', postController.update);
  routes.delete('/:id', postController.delete);

  return routes;
}