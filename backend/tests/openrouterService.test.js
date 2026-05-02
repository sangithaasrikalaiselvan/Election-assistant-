jest.mock("@openrouter/sdk", () => ({
  OpenRouter: jest.fn(),
}));

describe("openrouterService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when not configured", async () => {
    const { getOpenRouterResponse } = require("../services/openrouterService");
    const response = await getOpenRouterResponse("Hello");
    expect(response).toBeNull();
  });

  it("returns content when configured", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test-model";

    const { OpenRouter } = require("@openrouter/sdk");
    OpenRouter.mockImplementation(() => ({
      chat: {
        send: jest.fn(async () => ({
          choices: [{ message: { content: "Hi there" } }],
        })),
      },
    }));

    const { getOpenRouterResponse } = require("../services/openrouterService");
    const response = await getOpenRouterResponse("Hello");
    expect(response).toBe("Hi there");
  });

  it("returns null when OpenRouter throws", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test-model";

    const { OpenRouter } = require("@openrouter/sdk");
    OpenRouter.mockImplementation(() => ({
      chat: {
        send: jest.fn(async () => {
          throw new Error("boom");
        }),
      },
    }));

    const { getOpenRouterResponse } = require("../services/openrouterService");
    const response = await getOpenRouterResponse("Hello");
    expect(response).toBeNull();
  });

  it("streams chunks when configured", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.OPENROUTER_MODEL = "test-model";

    async function* stream() {
      yield { choices: [{ delta: { content: "Hello" } }] };
      yield { choices: [{ delta: { content: " world" } }] };
    }

    const { OpenRouter } = require("@openrouter/sdk");
    OpenRouter.mockImplementation(() => ({
      chat: {
        send: jest.fn(async () => stream()),
      },
    }));

    const { getOpenRouterStream } = require("../services/openrouterService");
    const generator = await getOpenRouterStream("Hello");

    const chunks = [];
    for await (const chunk of generator) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello", " world"]);
  });
});
