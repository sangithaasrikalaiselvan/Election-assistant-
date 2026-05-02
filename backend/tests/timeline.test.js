const request = require("supertest");
const app = require("../app");

describe("GET /api/timeline", () => {
  it("returns timeline items", async () => {
    const response = await request(app).get("/api/timeline");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.timeline)).toBe(true);
    expect(response.body.data.timeline.length).toBeGreaterThanOrEqual(6);
  });
});
