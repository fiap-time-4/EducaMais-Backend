import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { PostRepository } from "../repositories/PostRepository";

// Configuração da Injeção de Dependência (DI)
const postRepository = new PostRepository();
const postController = new PostController(postRepository);

/**
 * Configura e retorna o roteador para os endpoints de Post.
 * @returns {Router} Uma instância do roteador do Express com as rotas de post.
 */
export function PostRoutes(): Router {
  const routes = Router();

  /**
   * @route   GET /posts/search
   * @desc    Busca posts por um termo no título ou conteúdo.
   */
  routes.get('/search', postController.searchAll);

  /**
   * @route   POST /posts
   * @desc    Cria um novo post.
   */
  routes.post('/', postController.create);

  /**
   * @route   GET /posts
   * @desc    Lista todos os posts com paginação.
   */
  routes.get('/', postController.getAll);

  /**
   * @route   GET /posts/:id
   * @desc    Busca um post específico pelo seu ID.
   */
  routes.get('/:id', postController.getById);

  /**
   * @route   PUT /posts/:id
   * @desc    Atualiza um post existente.
   */
  routes.put('/:id', postController.update);

  /**
   * @route   DELETE /posts/:id
   * @desc    Deleta um post.
   */
  routes.delete('/:id', postController.delete);

  return routes;
}