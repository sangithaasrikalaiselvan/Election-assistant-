jest.mock("../services/geminiService", () => ({
  getGeminiResponse: jest.fn(async () => null),
  getGeminiStream: jest.fn(async () => null),
}));

jest.mock("../services/translateService", () => ({
  translateText: jest.fn(async (text, language) =>
    language === "es" ? `[es] ${text}` : text
  ),
}));

jest.mock("../services/dialogflowService", () => ({
  detectDialogflowIntent: jest.fn(async () => null),
}));

const {
  getChatResponse,
  getChatResponseStream,
  getTranslatedChatResponse,
  getTranslatedChatStream,
} = require("../services/chatService");
const { getGeminiResponse, getGeminiStream } = require("../services/geminiService");
const { detectDialogflowIntent } = require("../services/dialogflowService");
const { translateText } = require("../services/translateService");

const collectStream = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
};

describe("chatService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("responds with a guide step description", async () => {
    const response = await getChatResponse("Tell me about voting", "en");
    expect(response.intent).toBe("voting");
    expect(response.answer.toLowerCase()).toContain("voters");
  });

  it("returns timeline response with status line", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-05-01T10:00:00Z"));
    const response = await getChatResponse("Give me the timeline dates", "en");
    expect(response.intent).toBe("timeline");
    expect(response.answer).toContain("Timeline Status:");
    jest.useRealTimers();
  });

  it("returns steps response", async () => {
    const response = await getChatResponse("Show me the steps", "en");
    expect(response.intent).toBe("steps");
    expect(response.answer).toContain("Step-by-Step Breakdown");
  });

  it("returns greeting response", async () => {
    const response = await getChatResponse("hello", "en");
    expect(response.intent).toBe("greeting");
  });

  it("returns faq response when faq intent matches", async () => {
    const response = await getChatResponse("faq registration", "en");
    expect(response.intent).toBe("faq");
    expect(response.answer).toContain("Direct Answer");
  });

  it("uses dialogflow intent mapping when provided", async () => {
    detectDialogflowIntent.mockResolvedValueOnce({ intent: "Voting Day" });
    const response = await getChatResponse("Tell me more", "en");
    expect(response.intent).toBe("voting");
  });

  it("ignores dialogflow fallback intent", async () => {
    detectDialogflowIntent.mockResolvedValueOnce({
      intent: "Default Fallback Intent",
    });
    const response = await getChatResponse("hello", "en");
    expect(response.intent).toBe("greeting");
  });

  it("returns gemini response for general intent when available", async () => {
    getGeminiResponse.mockResolvedValueOnce("LLM response");
    const response = await getChatResponse("Tell me something new", "en");
    expect(response.intent).toBe("gemini");
    expect(response.answer).toBe("LLM response");
  });

  it("returns general fallback when gemini is unavailable", async () => {
    getGeminiResponse.mockResolvedValueOnce(null);
    const response = await getChatResponse("Tell me something new", "en");
    expect(response.intent).toBe("general");
  });

  it("returns gemini stream when available", async () => {
    async function* stream() {
      yield "hello";
      yield "world";
    }

    getGeminiStream.mockResolvedValueOnce(stream());
    const response = await getChatResponseStream("Tell me something new", "en");
    const chunks = await collectStream(response.stream);

    expect(response.intent).toBe("gemini");
    expect(chunks).toEqual(["hello", "world"]);
  });

  it("returns fallback stream when gemini is unavailable", async () => {
    getGeminiStream.mockResolvedValueOnce(null);
    const response = await getChatResponseStream("hello", "en");
    const chunks = await collectStream(response.stream);
    expect(response.intent).toBe("greeting");
    expect(chunks.length).toBe(1);
  });

  it("returns translated response", async () => {
    const response = await getTranslatedChatResponse("hello", "es");
    expect(translateText).toHaveBeenCalled();
    expect(response.answer.startsWith("[es] ")).toBe(true);
  });

  it("returns translated stream", async () => {
    const response = await getTranslatedChatStream("hello", "es");
    const chunks = await collectStream(response.stream);
    expect(chunks[0].startsWith("[es] ")).toBe(true);
  });
});
