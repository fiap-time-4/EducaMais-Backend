import prisma from '../util/prisma';
import { Post } from '@prisma/client';
import { CreatePostData, UpdatePostData } from '../validation/postValidation';

/**
 * Define a estrutura para opções de paginação.
 */
interface FindAllOptions {
  skip: number;
  take: number;
}

/**
 * Define a estrutura para opções de busca, estendendo a paginação.
 */
interface SearchOptions extends FindAllOptions {
  search?: string;
}

/**
 * Repositório para gerenciar as operações da entidade Post no banco de dados.
 */
export class PostRepository {

  /**
   * Cria um novo post no banco de dados.
   * @param {CreatePostData} data - Os dados para a criação do novo post.
   * @returns {Promise<Post>} O objeto do post criado, incluindo os dados do autor.
   */
  public async create(data: CreatePostData): Promise<Post> {
    return prisma.post.create({
      data: {
        titulo: data.titulo.trim(),
        conteudo: data.conteudo.trim(),
        autor: {
          connect: {
            id: data.autorId,
          },
        },
      },
      include: {
        autor: true,
      },
    });
  }

  /**
   * Atualiza um post existente no banco de dados.
   * @param {number} id - O ID do post a ser atualizado.
   * @param {UpdatePostData} data - Os dados a serem atualizados.
   * @returns {Promise<Post>} O objeto do post atualizado, incluindo o autor.
   */
  public async update(id: number, data: UpdatePostData): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        autor: true,
      },
    });
  }

  /**
   * Busca um post específico pelo seu ID.
   * @param {number} id - O ID do post a ser buscado.
   * @returns {Promise<Post | null>} O objeto do post encontrado ou nulo se não existir.
   */
  public async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        autor: true,
      },
    });
  }

  /**
   * Busca todos os posts com paginação.
   * @param {FindAllOptions} options - As opções de paginação (skip, take).
   * @returns {Promise<[Post[], number]>} Uma tupla contendo a lista de posts e o número total de posts.
   */
  public async findAll({ skip, take }: FindAllOptions): Promise<[Post[], number]> {
    return prisma.$transaction([
      prisma.post.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          autor: true,
        },
      }),
      prisma.post.count(),
    ]);
  }

  /**
   * Busca posts por um termo chave no título ou conteúdo, com paginação.
   * @param {SearchOptions} options - As opções de busca e paginação.
   * @returns {Promise<[Post[], number]>} Uma tupla contendo a lista de posts encontrados e o total.
   */
  public async search({ search, skip, take }: SearchOptions): Promise<[Post[], number]> {
    const where = search
      ? {
          OR: [
            { titulo: { contains: search, mode: 'insensitive' as const } },
            { conteudo: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return prisma.$transaction([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          autor: true,
        },
      }),
      prisma.post.count({ where }),
    ]);
  }

  /**
   * Deleta um post do banco de dados.
   * @param {number} id - O ID do post a ser deletado.
   * @returns {Promise<void>}
   */
  public async delete(id: number): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }
}