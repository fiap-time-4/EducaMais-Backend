import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";

/**
 * Controller para gerenciar as requisições HTTP da entidade User.
 * Lida com a lógica de rota, validação de entrada e formatação da resposta.
 */
export class UserController {
  /**
   * Cria uma instância do UserController.
   * @param {UserRepository} userRepository
   */
  constructor(private userRepository: UserRepository) {}

  /**
   * @route   POST /users
   * @desc    Cria um novo usuário.
   * @access  Público
   * @param {Request} req - O objeto de requisição do Express, esperando { email, name } no corpo.
   * @param {Response} res - O objeto de resposta do Express.
   * @returns {Promise<Response>} Retorna uma resposta JSON com o usuário criado ou uma mensagem de erro.
   */
  public create = async (req: Request, res: Response): Promise<Response> => {
    const { email, name } = req.body;

    try {
      if (!email) {
        return res.status(400).json({ error: "O email é obrigatório." });
      }

      const newUser = await this.userRepository.create(email, name);

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(409).json({ error: "Este email já está cadastrado." });
    }
  };
}
