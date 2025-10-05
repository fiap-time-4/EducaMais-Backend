const useMock = jest.fn();
const listenMock = jest.fn((port?: any, cb?: any) => {
  if (typeof cb === "function") cb();
  return {};
});
const jsonMock = jest.fn(() => "json-mw");

jest.mock("express", () => {
  const e: any = jest.fn(() => ({ use: useMock, listen: listenMock }));
  e.json = jsonMock;
  return e;
});

const corsMw = "cors-mw";
jest.mock("cors", () => {
  return () => corsMw;
});

jest.mock("../src/routes", () => ({ __mockedRoutes__: true }));

describe("server.ts", () => {
  const LOG = console.log;
  const ORIG_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    (useMock as any).mockClear();
    (listenMock as any).mockClear();
    (jsonMock as any).mockClear();
    console.log = jest.fn();
    process.env = { ...ORIG_ENV };
  });

  afterAll(() => {
    console.log = LOG;
    process.env = ORIG_ENV;
  });

  it("uses provided PORT", async () => {
    process.env.PORT = "5555";
    await import("../src/server");
    expect(listenMock).toHaveBeenCalled();
  });

  it("falls back to default 3333", async () => {
    delete process.env.PORT;
    jest.isolateModules(() => {
      require("../src/server");
    });
    expect(listenMock).toHaveBeenCalled();
  });
});
