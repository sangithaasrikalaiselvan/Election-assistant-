import { render, screen } from "@testing-library/react";
import ElectionTimeline from "./ElectionTimeline";

const timeline = [
  {
    id: 1,
    title: "Voter Registration",
    description: "Register to vote",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
  },
];

describe("ElectionTimeline", () => {
  it("renders timeline phase with status", () => {
    const originalDate = global.Date;
    global.Date = class extends Date {
      constructor() {
        super("2026-02-05T00:00:00");
      }
    };

    render(<ElectionTimeline data={timeline} />);
    expect(screen.getByText(/voter registration/i)).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();

    global.Date = originalDate;
  });
});
