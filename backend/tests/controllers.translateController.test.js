jest.mock("../services/translateService", () => ({
  translateText: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");
const { translateText } = require("../services/translateService");

describe("translateController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/translate returns success response", async () => {
    translateText.mockResolvedValue("Hola");

    const response = await request(app)
      .post("/api/translate")
      .send({ text: "Hello", language: "es" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.text).toBe("Hola");
    expect(response.body.data.language).toBe("es");
  });

  it("POST /api/translate returns validation error", async () => {
    const response = await request(app).post("/api/translate").send({ text: "" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
  });

  it("POST /api/translate returns error response on service failure", async () => {
    translateText.mockRejectedValue(new Error("Translate failed"));

    const response = await request(app)
      .post("/api/translate")
      .send({ text: "Hello", language: "es" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Translate failed");
  });
});
