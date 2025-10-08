import prisma from '../util/prisma';
import { Post } from '@prisma/client';
import { CreatePostData, UpdatePostData } from '../validation/postValidation';

// Interface para as opções de paginação
interface FindAllOptions {
  skip: number;
  take: number;
}

// MUDANÇA 1: Corrigido o erro de digitação de "FindAllAllOptions" para "FindAllOptions"
interface SearchOptions extends FindAllOptions {
  search?: string;
}

export class PostRepository {

  public async create(data: CreatePostData): Promise<Post> {
    // MUDANÇA 2: Esta é a principal correção.
    // O Prisma espera que a gente "conecte" o post a um autor existente
    // usando o campo de relação 'autor', e não passando 'autorId' diretamente.
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

  // O restante do código já estava quase todo correto, apenas faltava a correção
  // na interface SearchOptions que afetava o método search.
  // O 'include' funciona perfeitamente quando a criação/atualização está correta.

  public async update(id: number, data: UpdatePostData): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        autor: true,
      },
    });
  }

  public async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        autor: true,
      },
    });
  }

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

  public async delete(id: number): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }
}