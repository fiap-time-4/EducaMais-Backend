import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import {
  CreateUserData,
  UpdateUserData,
  UserValidationError,
  validateCreateUser,
  validateUpdateUser
} from "../validation/userValidation";

export class UserController {
  constructor(private userRepository: UserRepository) {}

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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        return res.status(400).json({
          success: false,
          message: "O autorId fornecido não corresponde a um usuário existente.",
        });
      }
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ success: false, message: "Não foi possível criar o usuário." });
    }
  };

  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      // CORREÇÃO: Forçamos o tipo string nas queries também para evitar erros futuros
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Pegando o role e garantindo que é string ou undefined
      const role = req.query.role as string | undefined;

      const [users, total] = await this.userRepository.findAll({
        skip,
        take: limit,
        role, 
      });

      return res.json({
        success: true,
        data: users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  };

  public searchAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      // CORREÇÃO: Garantimos que o search é string
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
      return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  };

  // --- MÉTODOS ONDE OCORRE O ERRO DE ID ---

  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      // CORREÇÃO: Usamos 'as string' para garantir que não é um array
      const id = req.params.id as string;
      
      const user = await this.userRepository.findById(id);

      if (!user) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      }

      return res.json({ success: true, data: user });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  };

  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      // CORREÇÃO: Usamos 'as string' aqui também
      const id = req.params.id as string;
      const updateData: UpdateUserData = req.body;

      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      }

      // Precisamos tipar o req.user corretamente ou fazer um cast se ele vier do middleware
      const requestUser = (req as any).user;

      if(requestUser && requestUser.role !== "ADMIN") {
        if (userExists.id !== requestUser.id) {
          return res.status(403).json({ success: false, message: "Ação não autorizada" });
        }

        if (updateData.role !== undefined) {
          return res.status(403).json({ success: false, message: "Ação não autorizada" });
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
      return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      // CORREÇÃO: Usamos 'as string' aqui também
      const id = req.params.id as string;

      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        return res.status(404).json({ success: false, message: "Usuário não encontrado" });
      }

      const requestUser = (req as any).user;

      if (requestUser && requestUser.role !== "ADMIN") {
        if (userExists.id !== requestUser.id) {
          return res.status(403).json({ success: false, message: "Ação não autorizada" });
        }
      }
      
      await this.userRepository.delete(id);
      return res.json({ success: true, message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  };
}