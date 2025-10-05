import { UserRoutes } from "../../src/routes/userRoutes";
import express from "express";

describe("routes/userRoutes.ts", () => {
  it("returns Router", () => {
    const r = UserRoutes();
    const app = express();
    app.use("/users", r);
    expect(typeof (r as any).use).toBe("function");
  });
});
