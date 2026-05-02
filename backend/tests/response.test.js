const { sendError, sendSuccess } = require("../utils/response");

const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("response utils", () => {
  it("sendSuccess wraps payload", () => {
    const res = createRes();
    sendSuccess(res, { hello: "world" }, "All good");

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { hello: "world" },
      message: "All good",
    });
  });

  it("sendError wraps payload without data", () => {
    const res = createRes();
    sendError(res, 400, "Bad request");

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Bad request",
    });
  });

  it("sendError includes data when provided", () => {
    const res = createRes();
    sendError(res, 422, "Validation failed", { errors: ["missing"] });

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      data: { errors: ["missing"] },
    });
  });
});
