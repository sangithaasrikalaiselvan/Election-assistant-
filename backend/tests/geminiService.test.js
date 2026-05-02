jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(),
}));

describe("geminiService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when not configured", async () => {
    const { getGeminiResponse } = require("../services/geminiService");
    const response = await getGeminiResponse("Hello");
    expect(response).toBeNull();
  });

  it("returns content when configured", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    process.env.GEMINI_MODEL = "gemini-1.5-flash";

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn(async () => ({
          response: { text: () => "Hi there" },
        })),
      }),
    }));

    const { getGeminiResponse } = require("../services/geminiService");
    const response = await getGeminiResponse("Hello");
    expect(response).toBe("Hi there");
  });

  it("returns null when Gemini throws", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn(async () => {
          throw new Error("boom");
        }),
      }),
    }));

    const { getGeminiResponse } = require("../services/geminiService");
    const response = await getGeminiResponse("Hello");
    expect(response).toBeNull();
  });

  it("streams chunks when supported", async () => {
    process.env.GEMINI_API_KEY = "test-key";

    async function* stream() {
      yield { text: () => "Hello" };
      yield { text: () => " world" };
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContentStream: jest.fn(async () => ({ stream: stream() })),
      }),
    }));

    const { getGeminiStream } = require("../services/geminiService");
    const generator = await getGeminiStream("Hello");

    const chunks = [];
    for await (const chunk of generator) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello", " world"]);
  });
});
