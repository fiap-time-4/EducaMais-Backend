import { PrismaClient, User } from '@prisma/client';

// Assumindo que você usa um arquivo de utilitário (utility file) para inicializar o PrismaClient,
// vamos importá-lo aqui para manter a consistência, se não, usamos 'new PrismaClient()'.
// Se seu 'util/prisma' for a instância única, use:
import prisma from '../util/prisma'; 

// Este repositório é responsável por todas as operações de CRUD para o modelo User.
export class UserRepository {
    
    // ----------------------------------------------------
    // Operação: Criação de um novo Usuário
    // ----------------------------------------------------
    public async create(email: string, name?: string): Promise<User> {
        // A lógica de criação usa o método 'create' do Prisma
        const newUser = await prisma.user.create({
            data: {
                email, // OBRIGATÓRIO (definido no schema.prisma)
                name,  // OPCIONAL (definido no schema.prisma)
            },
        });
        return newUser;
    }

    // Adicione outros métodos, como findById, findByEmail, etc., aqui futuramente.
}