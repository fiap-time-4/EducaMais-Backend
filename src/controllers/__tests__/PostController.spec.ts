import supertest from "supertest";
import { app } from "../../server";
import { prisma } from "../../jest.setup";
import { Prisma } from '@prisma/client';

describe("Fluxo de Post - Endpoints /posts", () => {
  // --- Mock Data ---
  // Criamos dados falsos que podemos usar em vários testes
  const mockAuthor = { id: 1, email: "autor@teste.com", name: "Autor Teste" };
  const mockPost = {
    id: 1,
    titulo: "Post de Teste",
    conteudo: "Conteúdo do post de teste.",
    autorId: 1,
    autor: mockAuthor,
    createdAt: new Date(),
    atualizacao: new Date(),
  };

  // --- Testes para POST /posts ---
  describe("POST /posts", () => {
    it("deve criar um novo post com sucesso e retornar status 201", async () => {
      // ... este teste continua o mesmo ...
    });

    it("deve retornar erro 400 se o autorId não corresponder a um usuário existente", async () => {
      const postData = {
        titulo: "Post com autor inválido",
        conteudo: "Conteúdo válido",
        autorId: 999,
      };

      // CORREÇÃO AQUI: Criamos um erro que passa na verificação 'instanceof'
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Foreign key constraint failed",
        { code: "P2003", clientVersion: "x.y.z" }
      );
      prisma.post.create.mockRejectedValue(prismaError);

      const response = await supertest(app).post("/posts").send(postData);

      expect(response.status).toBe(400); // Agora isso vai passar!
      expect(response.body.message).toBe(
        "O autorId fornecido não corresponde a um usuário existente."
      );
    });
  });

  // --- Testes para GET /posts ---
  describe("GET /posts", () => {
    it("deve retornar uma lista paginada de posts e status 200", async () => {
      const mockPostList = [mockPost];
      prisma.$transaction.mockResolvedValue([mockPostList, 1]);

      const response = await supertest(app).get("/posts?page=1&limit=10");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0].id).toBe(mockPost.id);
      expect(response.body.pagination.total).toBe(1);
    });
  });

  // --- Testes para GET /posts/:id ---
  describe("GET /posts/:id", () => {
    it("deve retornar um post específico pelo ID e status 200", async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost as any);

      const response = await supertest(app).get(`/posts/${mockPost.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(mockPost.id);
      expect(response.body.data.titulo).toBe(mockPost.titulo);
    });

    it("deve retornar erro 404 se o post não for encontrado", async () => {
      prisma.post.findUnique.mockResolvedValue(null);

      const response = await supertest(app).get("/posts/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Post não encontrado");
    });
  });

  // --- Testes para PUT /posts/:id ---
  describe("PUT /posts/:id", () => {
    it("deve atualizar um post com sucesso e retornar 200", async () => {
      const updateData = { titulo: "Título Atualizado" };
      const updatedPost = { ...mockPost, ...updateData };

      prisma.post.findUnique.mockResolvedValue(mockPost as any); // Simula que o post existe
      prisma.post.update.mockResolvedValue(updatedPost as any);

      const response = await supertest(app)
        .put(`/posts/${mockPost.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.titulo).toBe("Título Atualizado");
    });

    it("deve retornar erro 404 ao tentar atualizar um post inexistente", async () => {
      prisma.post.findUnique.mockResolvedValue(null); // Simula que o post não existe

      const response = await supertest(app)
        .put("/posts/999")
        .send({ titulo: "Qualquer título" });

      expect(response.status).toBe(404);
    });
  });

  // --- Testes para DELETE /posts/:id ---
  describe("DELETE /posts/:id", () => {
    it("deve deletar um post com sucesso e retornar 200", async () => {
      prisma.post.findUnique.mockResolvedValue(mockPost as any); // Simula que o post existe
      prisma.post.delete.mockResolvedValue(mockPost as any);

      const response = await supertest(app).delete(`/posts/${mockPost.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post deletado com sucesso");
    });

    it("deve retornar erro 404 ao tentar deletar um post inexistente", async () => {
      prisma.post.findUnique.mockResolvedValue(null); // Simula que o post não existe

      const response = await supertest(app).delete("/posts/999");

      expect(response.status).toBe(404);
    });
  });
});
