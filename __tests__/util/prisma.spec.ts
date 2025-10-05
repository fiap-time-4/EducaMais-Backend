const ctorSpy = jest.fn();
class MockPrisma {
  constructor() {
    ctorSpy();
  }
}
jest.mock("@prisma/client", () => ({ PrismaClient: MockPrisma }));

describe("util/prisma.ts", () => {
  it("instantiates PrismaClient and exports it", async () => {
    const mod = await import("../../src/util/prisma");
    expect(ctorSpy).toHaveBeenCalledTimes(1);
    expect(mod.default).toBeInstanceOf(MockPrisma as any);
  });
});
