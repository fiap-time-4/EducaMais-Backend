import { User } from '@prisma/client';
import prisma from '../util/prisma';

/**
 * Repositório para gerenciar as operações da entidade User no banco de dados.
 */
export class UserRepository {
  /**
   * Cria um novo usuário no banco de dados.
   * @param email O email do novo usuário (obrigatório).
   * @param name O nome do novo usuário (opcional).
   * @returns A promessa de um objeto User criado.
   */
  public async create(email: string, name?: string): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return newUser;
  }

}