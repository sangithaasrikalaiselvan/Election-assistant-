jest.mock("../services/knowledgeService", () => ({
  getFaq: jest.fn(),
  getGuideSteps: jest.fn(),
  getTimeline: jest.fn(),
}));

const request = require("supertest");
const app = require("../app");
const { getFaq, getGuideSteps, getTimeline } = require("../services/knowledgeService");

describe("knowledge controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/faq returns success response", async () => {
    getFaq.mockReturnValue([{ id: "faq-1" }]);

    const response = await request(app).get("/api/faq");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.faq)).toBe(true);
  });

  it("GET /api/faq returns error response on failure", async () => {
    getFaq.mockImplementation(() => {
      throw new Error("FAQ failed");
    });

    const response = await request(app).get("/api/faq");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("FAQ failed");
  });

  it("GET /api/guide returns success response", async () => {
    getGuideSteps.mockReturnValue([{ id: "registration" }]);

    const response = await request(app).get("/api/guide");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.steps)).toBe(true);
  });

  it("GET /api/guide returns error response on failure", async () => {
    getGuideSteps.mockImplementation(() => {
      throw new Error("Guide failed");
    });

    const response = await request(app).get("/api/guide");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Guide failed");
  });

  it("GET /api/timeline returns success response", async () => {
    getTimeline.mockReturnValue([{ id: "phase-1" }]);

    const response = await request(app).get("/api/timeline");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.timeline)).toBe(true);
  });

  it("GET /api/timeline returns error response on failure", async () => {
    getTimeline.mockImplementation(() => {
      throw new Error("Timeline failed");
    });

    const response = await request(app).get("/api/timeline");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Timeline failed");
  });
});
