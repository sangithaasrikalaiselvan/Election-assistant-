const request = require("supertest");
const app = require("../app");

describe("POST /api/chat", () => {
  it("returns a chat response", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({ message: "How do I register?", language: "en" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.answer.toLowerCase()).toContain("register");
  });

  it("validates missing message", async () => {
    const response = await request(app).post("/api/chat").send({});
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
