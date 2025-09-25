import { Request, Response } from 'express';
import prisma from '../util/prisma';
import { 
  validateCreatePost, 
  validateUpdatePost, 
  PostValidationError,
  CreatePostData,
  UpdatePostData 
} from '../validation/postValidation';

export class PostController {
  
  // Criar um novo post
  static async create(req: Request, res: Response) {
    try {
      const postData: CreatePostData = req.body;
      
      // Validar dados de entrada
      validateCreatePost(postData);
      
      // Criar post no banco de dados
      const post = await prisma.post.create({
        data: {
          titulo: postData.titulo.trim(),
          conteudo: postData.conteudo.trim(),
          autor: postData.autor.trim()
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Post criado com sucesso',
        data: post
      });

    } catch (error) {
      if (error instanceof PostValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao criar post:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar todos os posts
  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.post.count()
      ]);

      return res.json({
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar post por ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await prisma.post.findUnique({
        where: { id }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      return res.json({
        success: true,
        data: post
      });

    } catch (error) {
      console.error('Erro ao buscar post:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar post
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdatePostData = req.body;

      // Verificar se post existe
      const existingPost = await prisma.post.findUnique({
        where: { id }
      });

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      // Validar dados de atualização
      validateUpdatePost(updateData);

      // Preparar dados para atualização (apenas campos não vazios)
      const dataToUpdate: any = {};
      if (updateData.titulo) dataToUpdate.titulo = updateData.titulo.trim();
      if (updateData.conteudo) dataToUpdate.conteudo = updateData.conteudo.trim();
      if (updateData.autor) dataToUpdate.autor = updateData.autor.trim();

      // Atualizar post
      const updatedPost = await prisma.post.update({
        where: { id },
        data: dataToUpdate
      });

      return res.json({
        success: true,
        message: 'Post atualizado com sucesso',
        data: updatedPost
      });

    } catch (error) {
      if (error instanceof PostValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      console.error('Erro ao atualizar post:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Deletar post
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se post existe
      const existingPost = await prisma.post.findUnique({
        where: { id }
      });

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      // Deletar post
      await prisma.post.delete({
        where: { id }
      });

      return res.json({
        success: true,
        message: 'Post deletado com sucesso'
      });

    } catch (error) {
      console.error('Erro ao deletar post:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}