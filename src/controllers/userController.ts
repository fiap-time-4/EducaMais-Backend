import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import {
  CreateUserData,
  UpdateUserData,
  ChangeUserPassword,
  UserValidationError,
  validateCreateUser,
  validateUpdateUser,
  validateChangeUserPassword
} from "../validation/userValidation";

/**
 * Controller para gerenciar as requisições HTTP da entidade User.
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
   */
  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userData: CreateUserData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        appRole: req.body.appRole,
      }

      validateCreateUser(userData);

      const user = await this.userRepository.create(userData);

      return res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        data: user,
      });
    } catch (error) {
      if (error instanceof UserValidationError) {
        return res.status(400).json({ success: false, message: error.message });
      }

      // Verificação específica para o erro de chave estrangeira do Prisma
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "O autorId fornecido não corresponde a um usuário existente.",
        });
      }

      console.error("Erro ao criar usuário:", error);
      return res
        .status(500)
        .json({ success: false, message: "Não foi possível criar o usuário." });
    }
  };

  /**
   * @route   GET /users
   * @desc    Lista todos os usuários com paginação.
   * @access  Público
   */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository.findAll({
        skip,
        take: limit,
      });

      return res.json({
        success: true,
        data: users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  };

  /**
   * @route   GET /users/search
   * @desc    Busca usuários por um termo chave.
   * @access  Público
   */
  public searchAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string)?.trim();

      const [users, total] = await this.userRepository.search({
        search,
        skip,
        take: limit,
      });

      return res.json({
        success: true,
        data: users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  };

  /**
   * @route   GET /users/:id
   * @desc    Busca um usuário específico pelo ID.
   * @access  Público
   */
  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const user = await this.userRepository.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }

      return res.json({ success: true, data: user });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  };

  /**
   * @route   PUT /users/:id
   * @desc    Atualiza um usuário existente.
   * @access  Público
   */
  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const updateData: UpdateUserData = req.body;

      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }


      if(req.user.role === "STUDENT") {
        if (userExists.id !== req.user.id) {
          return res
            .status(403)
            .json({ success: false, message: "Ação não autorizada" });
        }

        if (updateData.role !== undefined) {
          return res
            .status(403)
            .json({ success: false, message: "Ação não autorizada" });
        }

      }
      

      validateUpdateUser(updateData);


      const updatedUser = await this.userRepository.update(
        id,
        updateData,
        req.headers as HeadersInit
      );

      return res.json({
        success: true,
        message: "Usuário atualizado com sucesso",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof UserValidationError) {
        return res.status(400).json({ success: false, message: error.message });
      }
      console.error("Erro ao atualizar usuário:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  };

  /**
   * @route   DELETE /users/:id
   * @desc    Deleta um usuário existente.
   * @access  Público
   */
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }

      if (req.user.role === "STUDENT") {
        if (userExists.id !== req.user.id) {
          return res
            .status(403)
            .json({ success: false, message: "Ação não autorizada" });
        }
      }
      

      await this.userRepository.delete(id);
      return res.json({ success: true, message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  };

  public changePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const usrData: ChangeUserPassword = {
        oldPassword: req.body.oldPassword || "",
        newPassword: req.body.newPassword,
      };

      validateChangeUserPassword(usrData);

      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }

      if( req.user.role === "STUDENT") {
        if (userExists.id !== req.user.id) {
          return res
            .status(403)
            .json({ success: false, message: "Ação não autorizada" });
        }

        await this.userRepository.changePassword(id, usrData, req.headers as HeadersInit);

        return res.json({
          success: true,
          message: "Senha alterada com sucesso",
        });
      }

      await this.userRepository.adminChangePassword(id, usrData.newPassword , req.headers as HeadersInit);
      return res.json({
        success: true,
        message: "Senha alterada com sucesso",
      });

    } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Erro interno do servidor" });
      }
  }
}
