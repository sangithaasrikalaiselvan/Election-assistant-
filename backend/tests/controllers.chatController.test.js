jest.mock("../services/chatService", () => ({
  getTranslatedChatResponse: jest.fn(),
  getTranslatedChatStream: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");
const {
  getTranslatedChatResponse,
  getTranslatedChatStream,
} = require("../services/chatService");

const collectStreamText = (text) =>
  String(text || "")
    .split("\n\n")
    .filter((line) => line.startsWith("data:"));

describe("chatController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/chat returns success response", async () => {
    getTranslatedChatResponse.mockResolvedValue({
      intent: "general",
      answer: "Hello",
      sources: ["general"],
      language: "en",
    });

    const response = await request(app)
      .post("/api/chat")
      .send({ message: "Hello there", language: "en" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.intent).toBe("general");
  });

  it("POST /api/chat returns validation error", async () => {
    const response = await request(app).post("/api/chat").send({ message: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("POST /api/chat returns error response on service failure", async () => {
    getTranslatedChatResponse.mockRejectedValue(new Error("Service failed"));

    const response = await request(app)
      .post("/api/chat")
      .send({ message: "Hello there", language: "en" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Service failed");
  });

  it("POST /api/chat/stream returns stream chunks", async () => {
    async function* stream() {
      yield "Hello";
      yield " world";
    }

    getTranslatedChatStream.mockResolvedValue({
      intent: "general",
      sources: ["general"],
      stream: stream(),
    });

    const response = await request(app)
      .post("/api/chat/stream")
      .send({ message: "Hello there", language: "en" });

    expect(response.status).toBe(200);
    const events = collectStreamText(response.text);
    expect(events.length).toBeGreaterThan(0);
    expect(response.text).toContain('"type":"done"');
  });

  it("POST /api/chat/stream returns validation error", async () => {
    const response = await request(app).post("/api/chat/stream").send({ message: "a" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("POST /api/chat/stream returns error response on service failure", async () => {
    getTranslatedChatStream.mockRejectedValue(new Error("Stream failed"));

    const response = await request(app)
      .post("/api/chat/stream")
      .send({ message: "Hello there", language: "en" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Stream failed");
  });
});
