import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { PostRepository } from "../repositories/postRepository";
import {
  validateCreatePost,
  validateUpdatePost,
  PostValidationError,
  CreatePostData,
  UpdatePostData,
} from "../validation/postValidation";

/**
 * Controller para gerenciar as requisições HTTP da entidade Post.
 */
export class PostController {
  /**
   * Cria uma instância do PostController.
   * @param {PostRepository} postRepository
   */
  constructor(private postRepository: PostRepository) {}

  /**
   * @route   POST /posts
   * @desc    Cria um novo post.
   * @access  Privado
   */
  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const postData: CreatePostData = {
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        autorId: req.user.id,
      }
      validateCreatePost(postData);

      const post = await this.postRepository.create(postData);

      return res.status(201).json({
        success: true,
        message: "Post criado com sucesso",
        data: post,
      });
    } catch (error) {
      if (error instanceof PostValidationError) {
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

      console.error("Erro ao criar post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Não foi possível criar o post." });
    }
  };

  /**
   * @route   GET /posts
   * @desc    Lista todos os posts com paginação. Aceita ?authorId=...
   * @access  Público
   */
  public getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // --- MUDANÇA AQUI: Captura o authorId da URL ---
      const authorId = req.query.authorId as string | undefined;

      const [posts, total] = await this.postRepository.findAll({
        skip,
        take: limit,
        authorId, // --- Repassa para o repositório
      });

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
  };

  /**
   * @route   GET /posts/search
   * @desc    Busca posts por um termo chave. Aceita ?authorId=...
   * @access  Público
   */
  public searchAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string)?.trim();
      
      // --- MUDANÇA AQUI TAMBÉM: Captura o authorId ---
      const authorId = req.query.authorId as string | undefined;

      const [posts, total] = await this.postRepository.search({
        search,
        skip,
        take: limit,
        authorId, // --- Repassa para o repositório
      });

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
  };

  /**
   * @route   GET /posts/:id
   * @desc    Busca um post específico pelo ID.
   * @access  Público
   */
  public getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const post = await this.postRepository.findById(Number(id));

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
  };

  /**
   * @route   PUT /posts/:id
   * @desc    Atualiza um post existente.
   * @access  Privado (Apenas dono ou Admin)
   */
  public update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const updateData: UpdatePostData = req.body;

      const postExists = await this.postRepository.findById(Number(id));
      if (!postExists) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado" });
      }

      // Verifica se quem está tentando editar é o dono ou é ADMIN
      // Ajuste para permitir que ADMIN edite qualquer post (opcional, mas recomendado)
      if (postExists.autorId !== req.user.id && req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ success: false, message: "Ação não autorizada" });
      }

      validateUpdatePost(updateData);

      const updatedPost = await this.postRepository.update(
        Number(id),
        updateData
      );

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
  };

  /**
   * @route   DELETE /posts/:id
   * @desc    Deleta um post existente.
   * @access  Privado (Apenas dono ou Admin)
   */
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      const postExists = await this.postRepository.findById(Number(id));
      if (!postExists) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado" });
      }

      // Verifica permissão (Dono ou Admin)
      if (postExists.autorId !== req.user.id && req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ success: false, message: "Ação não autorizada" });
      }

      await this.postRepository.delete(Number(id));

      return res.json({ success: true, message: "Post deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      return res
        .status(500)
        .json({ success: false, message: "Erro interno do servidor" });
    }
  };
}