import { Request, Response } from 'express';
// Não precisamos mais importar o Prisma diretamente aqui!
// import prisma from '../util/prisma'; 

// Importamos a nova classe de Repositório
import { UserRepository } from '../repositories/userRepository';

// Criamos uma instância do Repositório para ser usada
const userRepository = new UserRepository();

export class UserController {
    
    // Método para criar um novo usuário
    public async create(req: Request, res: Response) {
        // 1. Receber os dados do corpo da requisição
        const { email, name } = req.body;

        try {
            // **Validação básica (Opcional, mas recomendado)**
            if (!email) {
                return res.status(400).json({ error: 'O email é obrigatório para criar um usuário.' });
            }

            // 2. **Delegar a lógica de persistência para o Repositório**
            const newUser = await userRepository.create(email, name);

            // 3. Enviar a resposta de sucesso
            return res.status(201).json({ 
                message: 'Usuário criado com sucesso!', 
                user: newUser 
            });

        } catch (error) {
            // Captura erros (ex: falha de conexão, email duplicado, etc.)
            console.error(error);
            // Em caso de erro, retorna um status 500
            return res.status(500).json({ error: 'Não foi possível criar o usuário.' });
        }
    }

    // Listar todos os usuários (manter por agora)
}