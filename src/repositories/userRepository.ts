import prisma from '../util/prisma';
import { auth } from '../util/auth';
import { User } from '@prisma/client';
import { CreateUserData, UpdateUserData } from '../validation/userValidation';

/**
 * Define a estrutura para opções de paginação e FILTRO.
 */
interface FindAllOptions {
  skip: number;
  take: number;
  role?: string; // <--- ADICIONADO: Opcional para filtrar
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
   * Cria um novo usuário no banco de dados via Better Auth + Prisma.
   */
  public async create(usrData: CreateUserData): Promise<User> {
    console.log(usrData);
    const newUser = await auth.api.createUser({
      body: {
        email: usrData.email,
        password: usrData.password,
        name: usrData.name,
        role: usrData.role || "user", // Role do plugin (controle de acesso)
        data: { appRole: usrData.appRole || 'STUDENT' }, // Role da aplicação (negócio)
      }
    });

    return prisma.user.findUnique({
      where: { id: newUser.user.id },
    }) as Promise<User>;
  }

  /**
   * Atualiza um usuário existente.
   */
  public async update(id: string, usrData: UpdateUserData, headers: HeadersInit): Promise<User | null> {
    await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          name: usrData.name,
          email: usrData.email,
          password: usrData.password,
          role: usrData.role,
          data: { appRole: usrData.appRole },
        }
      },
      headers
    });

    return await prisma.user.findFirst({
      where: { id },
    });
  }

  public async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  /**
   * Busca todos os usuários com paginação E FILTRO DE ROLE.
   */
  public async findAll({ skip, take, role }: FindAllOptions): Promise<[User[], number]> {
    // --- AQUI ESTÁ A CORREÇÃO PRINCIPAL ---
    // Se o parâmetro 'role' vier (ex: "TEACHER"), filtramos pelo 'appRole'.
    // Se não vier, trazemos todos (objeto vazio).
    const where = role ? { appRole: role } : {};

    return prisma.$transaction([
      prisma.user.findMany({
        skip,
        take,
        where, // Aplica o filtro aqui
        orderBy: { createdAt: 'desc' },
        include: {
          posts: true,
        },
      }),
      prisma.user.count({ where }), // Conta apenas os filtrados para a paginação funcionar
    ]);
  }

  /**
   * Busca usuários por um termo chave.
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

  public async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}