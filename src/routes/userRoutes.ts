import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

/**
 * Configura e retorna o roteador para os endpoints de usuário.
 * @returns {Router} Uma instância do roteador do Express com as rotas de usuário.
 */
export function UserRoutes(): Router {
  const routes = Router();

  /**
   * @route
   * @desc
   * @access
   */
  routes.post("/", userController.create);

  return routes;
}
