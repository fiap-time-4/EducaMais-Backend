import express from "express";
import request from "supertest";
import { PostRoutes } from "../../src/routes/postRoutes";

const calls: Record<string, number> = {};
function mkHandler(name: string) {
  return (_req: any, res: any) => {
    calls[name] = (calls[name] || 0) + 1;
    if (name === "create") return res.status(201).json({ ok: name });
    return res.json({ ok: name });
  };
}

jest.mock("../../src/controllers/postController", () => ({
  PostController: {
    searchAll: jest.fn(mkHandler("searchAll")),
    create: jest.fn(mkHandler("create")),
    getAll: jest.fn(mkHandler("getAll")),
    getById: jest.fn(mkHandler("getById")),
    update: jest.fn(mkHandler("update")),
    delete: jest.fn(mkHandler("delete")),
  },
}));

describe("routes/postRoutes.ts", () => {
  const app = express();
  app.use(express.json());
  app.use("/posts", PostRoutes());

  it("wires all endpoints", async () => {
    await request(app).get("/posts/search");
    await request(app).post("/posts").send({});
    await request(app).get("/posts");
    await request(app).get("/posts/1");
    await request(app).put("/posts/1").send({ titulo: "x" });
    await request(app).delete("/posts/1");

    expect(calls).toEqual({
      searchAll: 1,
      create: 1,
      getAll: 1,
      getById: 1,
      update: 1,
      delete: 1,
    });
  });
});
