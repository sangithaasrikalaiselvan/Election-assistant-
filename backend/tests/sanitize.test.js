const { sanitizeInput } = require("../utils/sanitize");

describe("sanitizeInput", () => {
  it("removes html and trims whitespace", () => {
    expect(sanitizeInput(" <b>Hello</b> ")).toBe("Hello");
  });

  it("handles empty input", () => {
    expect(sanitizeInput("")).toBe("");
  });
});
