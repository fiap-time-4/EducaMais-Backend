// src/controllers/postController.ts

import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { PostRepository } from "../repositories/PostRepository"; // <-- Importa o Repositório
import {
  validateCreatePost,
  validateUpdatePost,
  PostValidationError,
  CreatePostData,
  UpdatePostData,
} from "../validation/postValidation";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export class PostController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Usuário não autenticado." });
      }

      const postData: CreatePostData = req.body;
      validateCreatePost(postData);

      // Usa o Repositório para criar o post
      const post = await PostRepository.create({
        titulo: postData.titulo.trim(),
        conteudo: postData.conteudo.trim(),
        authorId: userId,
      });

      return res
        .status(201)
        .json({
          success: true,
          message: "Post criado com sucesso",
          data: post,
        });
    } catch (error) {
      if (error instanceof PostValidationError) {
        return res.status(400).json({ success: false, message: error.message });
      }
      console.error("Erro ao criar post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Usa o Repositório para buscar os dados
      const [posts, total] = await Promise.all([
        PostRepository.findAll(skip, limit),
        PostRepository.countAll(),
      ]);

      return res.json({
        success: true,
        data: posts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async searchAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string)?.trim();

      const where: Prisma.PostWhereInput = search
        ? {
            OR: [
              { titulo: { contains: search, mode: "insensitive" } },
              { conteudo: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      // Usa o Repositório para a busca
      const [posts, total] = await Promise.all([
        PostRepository.search(where, skip, limit),
        PostRepository.countSearch(where),
      ]);

      return res.json({
        success: true,
        data: posts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostRepository.findById(Number(id)); // Usa o Repositório

      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado" });
      }
      return res.json({ success: true, data: post });
    } catch (error) {
      console.error("Erro ao buscar post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdatePostData = req.body;

      const existingPost = await PostRepository.findById(Number(id)); // Usa o Repositório
      if (!existingPost) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado" });
      }

      validateUpdatePost(updateData);

      const dataToUpdate: UpdatePostData = {};
      if (updateData.titulo) dataToUpdate.titulo = updateData.titulo.trim();
      if (updateData.conteudo)
        dataToUpdate.conteudo = updateData.conteudo.trim();

      const updatedPost = await PostRepository.update(Number(id), dataToUpdate); // Usa o Repositório

      return res.json({
        success: true,
        message: "Post atualizado com sucesso",
        data: updatedPost,
      });
    } catch (error) {
      if (error instanceof PostValidationError) {
        return res.status(400).json({ success: false, message: error.message });
      }
      console.error("Erro ao atualizar post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existingPost = await PostRepository.findById(Number(id)); // Usa o Repositório
      if (!existingPost) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado" });
      }

      await PostRepository.delete(Number(id)); // Usa o Repositório
      return res.status(204).send(); // <-- Mantendo o ajuste para 204 No Content
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  }
}
