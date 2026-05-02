const { detectIntent } = require("../utils/intent");

describe("detectIntent", () => {
  it("detects greeting", () => {
    expect(detectIntent("Hello there")).toBe("greeting");
  });

  it("detects voting intent", () => {
    expect(detectIntent("When is voting day?")).toBe("voting");
  });

  it("detects timeline intent", () => {
    expect(detectIntent("Show me the timeline")).toBe("timeline");
  });

  it("falls back to general", () => {
    expect(detectIntent("Random topic")).toBe("general");
  });
});
