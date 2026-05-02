const SimpleCache = require("../utils/cache");

describe("SimpleCache", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns cached value before expiration", () => {
    const cache = new SimpleCache(1000);
    cache.set("key", "value");

    expect(cache.get("key")).toBe("value");
  });

  it("expires values after ttl", () => {
    const cache = new SimpleCache(1000);
    cache.set("key", "value");

    jest.advanceTimersByTime(1001);
    expect(cache.get("key")).toBeNull();
  });
});
