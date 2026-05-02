const originalFetch = global.fetch;

describe("translateService", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        data: { translations: [{ translatedText: "Hola" }] },
      }),
    }));
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });

  it("returns translated text when API is available", async () => {
    const { translateText } = require("../services/translateService");
    const result = await translateText("Hello", "es");
    expect(result).toBe("Hola");
  });

  it("returns original text for empty or English input", async () => {
    const { translateText } = require("../services/translateService");
    expect(await translateText("", "es")).toBe("");
    expect(await translateText("Hello", "en")).toBe("Hello");
  });

  it("returns cached response for repeated calls", async () => {
    const { translateText } = require("../services/translateService");
    await translateText("Hello", "es");
    await translateText("Hello", "es");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns fallback when API key is missing", async () => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
    const { translateText } = require("../services/translateService");
    const result = await translateText("Hello", "es");
    expect(result).toBe("[es] Hello");
  });

  it("returns fallback when API fails", async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 500 }));
    const { translateText } = require("../services/translateService");
    const result = await translateText("Hello", "es");
    expect(result).toBe("[es] Hello");
  });
});
