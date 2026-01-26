import prisma from '../util/prisma';
import { auth } from '../util/auth';
import { User } from '@prisma/client';
import { CreateUserData,UpdateUserData, ChangeUserPassword } from '../validation/userValidation';

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
 * Repositório para gerenciar as operações da entidade User no banco de dados.
 */
export class UserRepository {

  /**
   * Cria um novo post no banco de dados.
   * @param {CreateUserData} usrData - Os dados para a criação do novo post.
   * @returns {Promise<User>} O objeto do post criado, incluindo os dados do autor.
   */
  public async create(usrData: CreateUserData): Promise<User> {
    console.log(usrData);
    const newUser = await auth.api.createUser({
      body: {
        email: usrData.email,
        password: usrData.password,
        name: usrData.name,
        role: usrData.role || "user",
        data: {appRole: usrData.appRole || 'STUDENT'},
      }
    });

    return prisma.user.findUnique({
      where: { id: newUser.user.id },
    }) as Promise<User>;
  }

  /**
   * Atualiza um post existente no banco de dados.
   * @param {string} id - O ID do post a ser atualizado.
   * @param {UpdateUserData} usrData - Os dados a serem atualizados.
   * @param {headers} headers - Os cabeçalhos da requisição.
   * @returns {Promise<User>} O objeto do post atualizado, incluindo o autor.
   */
  public async update(id: string, usrData: UpdateUserData, headers: HeadersInit): Promise<User | null> {
    await auth.api.adminUpdateUser({
      body:{
        userId: id,
        data: {
          name: usrData.name,
          email: usrData.email,
          password: usrData.password,
          role: usrData.role,
          data: {appRole: usrData.appRole},
        }
      },
      headers
      
    });

    return await prisma.user.findFirst({
      where: { id },
    });

  }

  /**
   * Busca um post específico pelo seu ID.
   * @param {string} id - O ID do post a ser buscado.
   * @returns {Promise<User | null>} O objeto do post encontrado ou nulo se não existir.
   */
  public async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  /**
   * Busca todos os posts com paginação.
   * @param {FindAllOptions} options - As opções de paginação (skip, take).
   * @returns {Promise<[User[], number]>} Uma tupla contendo a lista de posts e o número total de posts.
   */
  public async findAll({ skip, take }: FindAllOptions): Promise<[User[], number]> {
    return prisma.$transaction([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          posts: true,
        },
      }),
      prisma.user.count(),
    ]);
  }

  /**
   * Busca posts por um termo chave no título ou conteúdo, com paginação.
   * @param {SearchOptions} options - As opções de busca e paginação.
   * @returns {Promise<[User[], number]>} Uma tupla contendo a lista de posts encontrados e o total.
   */
  public async search({ search, skip, take }: SearchOptions): Promise<[User[], number]> {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          posts: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
  }

  /**
   * Deleta um post do banco de dados.
   * @param {string} id - O ID do post a ser deletado.
   * @returns {Promise<void>}
   */
  public async delete(id: string): Promise<void> {
    await auth.api.revokeUserSessions({
      body: {
        userId: id,
      }
    });

    await prisma.user.delete({
      where: { id },
    });
  }

  public async changePassword(id: string, usrData: ChangeUserPassword, headers: HeadersInit): Promise<void> {
    await auth.api.changePassword({
        body: {
            newPassword: usrData.newPassword,
            currentPassword: usrData.oldPassword,
            revokeOtherSessions: true,
        },
        headers
    });
  }

  public async adminChangePassword(id: string, password: string, headers: HeadersInit): Promise<void> {
    await auth.api.setUserPassword({
      body: {
          newPassword: password, 
          userId: id, 
      },
      headers
    })
  }
}