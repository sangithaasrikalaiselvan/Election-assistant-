describe("logger", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it("initializes in test mode", () => {
    process.env = { ...originalEnv, NODE_ENV: "test" };
    const logger = require("../utils/logger");
    expect(logger).toBeDefined();
  });

  it("initializes in non-test mode", () => {
    process.env = { ...originalEnv, NODE_ENV: "production" };
    const logger = require("../utils/logger");
    expect(logger).toBeDefined();
  });
});
