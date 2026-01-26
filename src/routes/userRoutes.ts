import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";
import { ensureAuthenticated, ensureAuthenticatedAsAdminOrTeacher } from "../middlewares/ensure_auth" ;

// Configuração da Injeção de Dependência (DI)
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

/**
 * Configura e retorna o roteador para os endpoints de User.
 * @returns {Router} Uma instância do roteador do Express com as rotas de user.
 */
export function UserRoutes(): Router {
  const routes = Router();

  /**
   * @route   GET /users/search
   * @desc    Busca usuários por um termo no nome ou email.
   */
  routes.get('/search', userController.searchAll);

  /**
   * @route   POST /users
   * @desc    Cria um novo usuário.
   */
  routes.post('/', ensureAuthenticatedAsAdminOrTeacher, userController.create);

  /**
   * @route   GET /users
   * @desc    Lista todos os usuários com paginação.
   */
  routes.get('/', userController.getAll);

  /**
   * @route   GET /users/:id
   * @desc    Busca um usuário específico pelo seu ID.
   */
  routes.get('/:id', userController.getById);

  /**
   * @route   PUT /users/:id
   * @desc    Atualiza um usuário existente.
   */
  routes.put('/:id', ensureAuthenticated, userController.update);

  /**
   * @route   DELETE /users/:id
   * @desc    Deleta um usuário.
   */
  routes.delete('/:id', ensureAuthenticated, userController.delete);

  routes.post('/:id/change-password', ensureAuthenticated, userController.changePassword);

  return routes;
}