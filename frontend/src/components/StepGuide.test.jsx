import { render, screen } from "@testing-library/react";
import StepGuide from "./StepGuide";

const steps = [
  { title: "Registration", description: "Register to vote", icon: "ID" },
  { title: "Voting", description: "Cast your ballot", icon: "VOTE" },
];

describe("StepGuide", () => {
  it("renders the first step and progress", () => {
    render(<StepGuide steps={steps} loading={false} />);
    expect(screen.getByText("Registration")).toBeInTheDocument();
    expect(screen.getByText(/complete/i)).toBeInTheDocument();
  });
});
