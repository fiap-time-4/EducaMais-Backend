import { Router } from "express";
// Importamos o Controller que acabámos de refatorar
import { UserController } from "../controllers/userController"; 

// Criamos uma instância do Controller
const userController = new UserController();

export function UserRoutes() {
  const routes = Router();

  // 1. Rota para a Criação de Usuário (POST /)
  // Chamamos o método 'create' do UserController
  routes.post('/', userController.create); 

  return routes;
}