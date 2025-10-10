import supertest from 'supertest';
import { app } from '../../server';
import { prisma } from '../../jest.setup';

describe('Fluxo de Usuário - Endpoints /users', () => {

  // Teste para o cenário de sucesso da criação
  it('POST /users -> Deve criar um novo usuário com sucesso', async () => {
    // 1. DADOS DE ENTRADA E MOCK
    const userData = { email: 'novo@email.com', name: 'Novo Usuário' };
    const expectedUser = { id: 1, ...userData };

    // Dizemos ao nosso Prisma "fake" o que ele deve retornar
    prisma.user.create.mockResolvedValue(expectedUser);

    // 2. AÇÃO: Faz a chamada na API
    const response = await supertest(app)
      .post('/users')
      .send(userData);

    // 3. VERIFICAÇÃO: Checa se a resposta está correta
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Usuário criado com sucesso!',
      user: expectedUser,
    });
  });

  // Teste para o cenário de falha por falta de dados
  it('POST /users -> Deve retornar erro 400 se o email não for fornecido', async () => {
    const response = await supertest(app)
      .post('/users')
      .send({ name: 'Usuário Sem Email' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'O email é obrigatório.' });
  });

  // Teste para o cenário de falha por email duplicado
  it('POST /users -> Deve retornar erro 409 se o email já existir', async () => {
    // 1. DADOS DE ENTRADA E MOCK DO ERRO
    const userData = { email: 'existente@email.com', name: 'Usuário Existente' };

    // Simulamos o erro P2002 (unique constraint failed) do Prisma
    const prismaError = { code: 'P2002', meta: { target: ['email'] } };
    prisma.user.create.mockRejectedValue(prismaError);

    // 2. AÇÃO
    const response = await supertest(app)
      .post('/users')
      .send(userData);

    // 3. VERIFICAÇÃO
    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Este email já está cadastrado.' });
  });

});