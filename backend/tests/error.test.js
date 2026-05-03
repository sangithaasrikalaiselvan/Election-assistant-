const { errorHandler, notFound } = require("../middlewares/errorHandler");

const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("error middleware", () => {
  it("notFound returns 404 payload", () => {
    const res = createRes();
    notFound({}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Not found",
    });
  });

  it("errorHandler returns provided status and message", () => {
    const res = createRes();
    errorHandler({ status: 401, message: "Unauthorized" }, {}, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
  });

  it("errorHandler defaults to server error", () => {
    const res = createRes();
    errorHandler({}, {}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Server error",
    });
  });
});
