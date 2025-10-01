import { Router, Request, Response } from "express";
import { PostController } from "../controllers/postController";

const routes = Router();

routes.get('/health', (req: Request, res: Response) => {
  const message = `Health Check OK, Backend is running on port ${process.env.PORT}!`;

  return res.json({ message });
});

// Rotas para Posts
routes.get('/posts/search', PostController.searchAll);
routes.post('/posts', PostController.create);
routes.get('/posts', PostController.getAll);
routes.get('/posts/:id', PostController.getById);
routes.put('/posts/:id', PostController.update);
routes.delete('/posts/:id', PostController.delete);

export default routes;