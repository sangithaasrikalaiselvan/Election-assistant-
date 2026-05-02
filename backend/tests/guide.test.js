const request = require("supertest");
const app = require("../app");

describe("GET /api/guide", () => {
  it("returns guide steps", async () => {
    const response = await request(app).get("/api/guide");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.steps)).toBe(true);
    expect(response.body.data.steps.length).toBeGreaterThanOrEqual(6);
  });
});
