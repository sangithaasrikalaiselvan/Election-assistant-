const request = require("supertest");
const app = require("../app");

describe("GET /api/faq", () => {
  it("returns faq items", async () => {
    const response = await request(app).get("/api/faq");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.faq)).toBe(true);
    expect(response.body.data.faq.length).toBeGreaterThanOrEqual(10);
  });
});
