import { Request, Response } from "express";
import { PostController } from "../../src/controllers/postController";
import prisma from "../../src/util/prisma";

jest.mock("../../src/util/prisma", () => ({
  __esModule: true,
  default: {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response & { status: jest.Mock; json: jest.Mock };
}
function mockReq(body: any = {}, params: any = {}, query: any = {}) {
  return { body, params, query } as unknown as Request;
}

describe("controllers/postController.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("create: success (201)", async () => {
    (prisma.post.create as jest.Mock).mockResolvedValue({
      id: 1,
      titulo: "t",
      conteudo: "1234567890",
      autor: "a",
    });
    const req = mockReq({ titulo: "t", conteudo: "1234567890", autor: "a" });
    const res = mockRes();
    await PostController.create(req, res);
    expect(prisma.post.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("create: validation error → 400", async () => {
    const req = mockReq({ titulo: "", conteudo: "1234567890", autor: "a" });
    const res = mockRes();
    await PostController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("create: prisma error → 500", async () => {
    (prisma.post.create as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = mockReq({ titulo: "t", conteudo: "1234567890", autor: "a" });
    const res = mockRes();
    await PostController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getAll: success", async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (prisma.post.count as jest.Mock).mockResolvedValue(1);
    const req = mockReq();
    const res = mockRes();
    await PostController.getAll(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("getAll: error → 500", async () => {
    (prisma.post.findMany as jest.Mock).mockRejectedValue(new Error("db"));
    const req = mockReq();
    const res = mockRes();
    await PostController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("searchAll: with search", async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (prisma.post.count as jest.Mock).mockResolvedValue(1);
    const req = mockReq({}, {}, { search: "abc" });
    const res = mockRes();
    await PostController.searchAll(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("searchAll: without search", async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (prisma.post.count as jest.Mock).mockResolvedValue(1);
    const req = mockReq({}, {}, {});
    const res = mockRes();
    await PostController.searchAll(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("searchAll: error → 500", async () => {
    (prisma.post.findMany as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = mockReq({}, {}, { search: "abc" });
    const res = mockRes();
    await PostController.searchAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getById: 404 when not found", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "x" });
    const res = mockRes();
    await PostController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getById: success", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await PostController.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  // Cover lines 161-162: catch → 500
  test("getById: prisma error → 500", async () => {
    (prisma.post.findUnique as jest.Mock).mockRejectedValue(
      new Error("db fail")
    );
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await PostController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("update: 404 when not found", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({ titulo: "n" }, { id: "1" });
    const res = mockRes();
    await PostController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("update: success", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.update as jest.Mock).mockResolvedValue({ id: 1, titulo: "n" });
    const req = mockReq({ titulo: "n" }, { id: "1" });
    const res = mockRes();
    await PostController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("update: validation error → 400", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({ titulo: "   " }, { id: "1" });
    const res = mockRes();
    await PostController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Cover lines 193-195 (trim dos 3 campos): ramo TRUE dos ifs
  test("update: faz trim de titulo/conteudo/autor antes de atualizar", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.update as jest.Mock).mockResolvedValue({
      id: 1,
      titulo: "novo",
    });

    const req = mockReq(
      {
        titulo: "   Título com espaço   ",
        conteudo: "   Conteúdo com espaço   ",
        autor: "   Autor com espaço   ",
      },
      { id: "1" }
    );
    const res = mockRes();

    await PostController.update(req, res);

    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        titulo: "Título com espaço",
        conteudo: "Conteúdo com espaço",
        autor: "Autor com espaço",
      },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  // Cover lines 193-195: ramo FALSE (nenhum campo → data: {})
  test("update: sem campos opcionais enviados não define chaves em data", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.update as jest.Mock).mockResolvedValue({ id: 1 });

    const req = mockReq({}, { id: "1" }); // sem titulo/conteudo/autor
    const res = mockRes();

    await PostController.update(req, res);

    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {},
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  // Cover lines 217-218: catch → 500 (non-validation error)
  test("update: prisma error → 500", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.update as jest.Mock).mockRejectedValue(
      new Error("update fail")
    );
    const req = mockReq({ titulo: "novo titulo" }, { id: "1" });
    const res = mockRes();
    await PostController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("delete: 404 when not found", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    const req = mockReq({}, { id: "999" });
    const res = mockRes();
    await PostController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("delete: success", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.delete as jest.Mock).mockResolvedValue({ id: 1 });
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await PostController.delete(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("delete: error → 500", async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.post.delete as jest.Mock).mockRejectedValue(new Error("boom"));
    const req = mockReq({}, { id: "1" });
    const res = mockRes();
    await PostController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
