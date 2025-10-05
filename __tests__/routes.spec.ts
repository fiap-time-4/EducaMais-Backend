import request from "supertest";
import express, { Router } from "express";

jest.mock("../src/routes/postRoutes", () => ({
  PostRoutes: () => Router(),
}));
jest.mock("../src/routes/userRoutes", () => ({
  UserRoutes: () => Router(),
}));

import routes from "../src/routes";

describe("routes.ts", () => {
  it("GET /health", async () => {
    const app = express();
    app.use(routes);
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Health Check OK/);
  });
});
