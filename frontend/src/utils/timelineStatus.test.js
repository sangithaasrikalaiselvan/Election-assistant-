import { getTimelineStatus } from "./timelineStatus";

describe("getTimelineStatus", () => {
  it("returns COMPLETED when today is after end date", () => {
    const today = new Date("2026-03-01T00:00:00");
    const status = getTimelineStatus(today, "2026-01-05", "2026-02-05");
    expect(status).toBe("COMPLETED");
  });

  it("returns ACTIVE when today is within range", () => {
    const today = new Date("2026-04-20T00:00:00");
    const status = getTimelineStatus(today, "2026-04-20", "2026-04-21");
    expect(status).toBe("ACTIVE");
  });

  it("returns UPCOMING when today is before start date", () => {
    const today = new Date("2026-01-01T00:00:00");
    const status = getTimelineStatus(today, "2026-02-10", "2026-02-24");
    expect(status).toBe("UPCOMING");
  });
});
